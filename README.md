Zephyr Server
=============

[![Build Status](https://travis-ci.org/ZephyrVR/server.svg?branch=master)](https://travis-ci.org/ZephyrVR/server)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ZephyrVR/server/master/LICENSE)

Zephyr backend, responsible for authentication and notification transport.

## Installation

### Dependencies
First, download dependencies by running `npm install`.

### Configuration
There are a couple of options to configure Zephyr Server depending on your preference.

#### Environment variables
You can set the following environment variables before execution to configure the utility:

 * `NODE_ENV` - `production` or `development`
 * `PORT` - port by which to access Zephyr Server
 * `EXPRESS_LOGGING` - toggle Express's request logging
 * `SESSION_SECRET` - session secret
 * `TOKEN_SECRET` - app authorization token secret
 * `JWT_SECRET` - JWT secret
 * `STEAM_RETURN_URL` - URL to return to after Steam login (`$STEAM_REALM + auth/steam/callback`)
 * `STEAM_REALM` - base URL of Zephyr Server (include trailing slash)
 * `STEAM_API_KEY` - Steam [API Key](https://steamcommunity.com/dev/apikey)
 * `DB_URL` - URL to MongoDB instance (`mongo://...`)

#### Config file
Alternatively, you can configure Zephyr Server by either directly editing the `config.json` file found [here](https://github.com/ZephyrVR/server/blob/master/config/config.js) or by creating a file named `config-private.js` ([see example](https://gist.github.com/ThomasGaubert/6e3d2fffc2669e2d74d10b24cbd84f33)) in the same directory.