# Tao Wallet Web

Learn more about [Tao Wallet](https://github.com/dannydeezy/tao-wallet).

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

- Rename .env.example to .env file
  ```sh
  mv .env.example .env
  ```
  > Change the SESSION_SECRET if you want

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

## Deployed on Fly

- [Check it out](https://tao-wallet-web-6fe3.fly.dev)
