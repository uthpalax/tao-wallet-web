import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

const algorithm = "aes-256-ctr";
if (!process.env.ENCRYPTION_KEY_1 || !process.env.ENCRYPTION_KEY_2) {
  throw new Error("Please setup encryption keys");
}
const secretKey = process.env.ENCRYPTION_KEY_1 + process.env.ENCRYPTION_KEY_2;

export type { User } from "@prisma/client";

export async function encryptAllSecrets() {
  const crypto = await import("node:crypto");
  const algorithm = "aes-256-ctr";
  if (!process.env.ENCRYPTION_KEY_1 || !process.env.ENCRYPTION_KEY_2) {
    throw new Error("Please setup encryption keys");
  }
  const secretKey = process.env.ENCRYPTION_KEY_1 + process.env.ENCRYPTION_KEY_2;

  const usersWithUnecryptedLnmSecrets = await prisma.password.findMany({
    where: {
      iv: "",
    },
  });

  usersWithUnecryptedLnmSecrets.forEach(async (data) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(data.lnmSecret),
      cipher.final(),
    ]);

    const encryptedLnmSecret = encrypted.toString("hex");
    const user = await prisma.password.update({
      where: {
        userId: data.userId,
      },
      data: {
        encryptedLnmSecret,
        iv: iv.toString("hex"),
      },
    });

    return user.userId;
  });
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const crypto = await import("node:crypto");
  const lnmSecret = crypto.randomBytes(16).toString("hex");

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(lnmSecret), cipher.final()]);

  const encryptedLnmSecret = encrypted.toString("hex");

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
          lnmSecret,
          encryptedLnmSecret,
          iv: iv.toString("hex"),
        },
      },
    },
  });
}

export async function getUserLnmSecret(userId: string) {
  const crypto = await import("node:crypto");

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      password: true,
    },
  });

  if (!user?.password?.encryptedLnmSecret || !user?.password?.iv) {
    return null;
  }
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(user.password.iv, "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(user.password.encryptedLnmSecret, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
