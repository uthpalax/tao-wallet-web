# Tao Wallet Web

Learn more about [Remix Stacks](https://github.com/dannydeezy/tao-wallet).

## What's in the stack

This project is using remix blues-stack(https://github.com/remix-run/blues-stack)

## Development Steps

- Clone the project

  ```sh
  git clone git@github.com:Uthpala/tao-wallet-web.git
  ```

- Install Dependencies

  ```sh
  npm install
  ```

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

  ```sh
  npm run docker
  ```

  > **Note:** The npm script will complete while Docker sets up the container in the background. Ensure that Docker has finished and your container is running before proceeding.

- Initial setup:

  ```sh
  npm run setup
  ```

- Run the first build:

  ```sh
  npm run build
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

If you'd prefer not to use Docker, you can also use Fly's Wireguard VPN to connect to a development database (or even your production database). You can find the instructions to set up Wireguard [here](https://fly.io/docs/reference/private-networking/#install-your-wireguard-app), and the instructions for creating a development database [here](https://fly.io/docs/reference/postgres/).

## Deployed

- [Staging](tao-wallet-web-6fe3-staging.fly.dev)
- [Production](tao-wallet-web-6fe3.fly.dev)
