/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lnmSecret` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- AlterTable
ALTER TABLE "Password" ADD COLUMN     "lnmSecret" TEXT NOT NULL;

-- DropTable
DROP TABLE "Note";
