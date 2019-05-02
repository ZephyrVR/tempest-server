Zephyr Server
=============

> **NOTE:** This project was part of [Project Tempest](https://github.com/ZephyrVR/documents/blob/master/project-tempest.md) and is no longer actively maintained.

Zephyr backend, responsible for authentication and notification transport.

## Installation

### Docker
[Docker](https://www.docker.com/) is recommended to get up and running quickly with minimal effort. Run the following to build the Docker images:

`docker-compose up`

### Configuration
There are a couple of options to configure Zephyr Server depending on your preference.

#### Environment variables
You can set the following environment variables before execution to configure the server:

 * `NODE_ENV` - `production` or `development`
 * `ADMIN_STEAM_ID` - Steam ID of user to automatically grant admin permissions
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

### Running
For development environments, use `docker-compose up`. This will use the settings defined in `docker-compose.override.yml`.

For production environments, use `docker-compose -f docker-compose.yml up`. You can optionally add additional configuration files to override the settings defined in `docker-compose.yml`.
