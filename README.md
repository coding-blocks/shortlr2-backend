<h1 align="center"><a href="https://online.codingblocks.com">
   <img src="https://raw.githubusercontent.com/YashKumarVerma/shortlr2-backend/readme-update/docs/illustrations/coding-blocks-logo.png" alt="Coding Blocks Online"/></h1>

<p align="center">
  <a href="https://twitter.com/intent/follow?screen_name=codingblocksin">
    <img src="https://img.shields.io/twitter/follow/codingblocks.svg?label=Follow%20@codingblocksin" alt="Follow @codingblocksin" />
  </a>
</p>

This is the source code for the URL shortener service for Coding Blocks. It has the backend as well as the frontend combined. With goo.gl having shut down and most unique single word links at bit.ly having run out, we have made cb.lk open for anyone to use. Only one catch - you need to login using a Coding Blocks account.

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## Installation

- Clone the repository using `git clone https://github.com/coding-blocks/shortlr2-backend`
- Open the cloned repository `cd shortlr2-backend`
- Create new client credentials on [OneAuth](https://account.codingblocks.com/clients/add)
  - Set `domain` as `localhost:3987`
  - Set `client ame` as a string to identify this client uniquely
  - Set `callback url` as `http://localhost:3987/login/callback`
  - Set `default url` as `http://localhost:3987`
  - Enter the `ONEAUTH_CLIENT_ID` and `ONEAUTH_CLIENT_SECRET` obtained in `secrets.json`
- Install packages using `yarn install`.

## Development

- Start the development version by running `yarn dev`
- Visit [http://localhost:3987](http://localhost:3987).
- To generate coverage reports, run `yarn cover`

## Production

- Run `yarn start`. This would
  - First run linting fixes on application (lint)
  - Then transpile the application using typescript (build)
  - Then run the tests (test)
  - Then launch the application (run)
