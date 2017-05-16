var fs = require('fs');
var config = {};

if (fs.existsSync(__dirname + '/config-private.js')) {
  console.log('Using private configuration file...');
  config = require('./config-private');
} else {
  loadDefaults();
}

function loadDefaults() {
  // Environment
  config.environment = process.env.NODE_ENV || 'development';

  // Administration
  config.adminSteamId = process.env.ADMIN_STEAM_ID || 'ADMIN_STEAM_ID';

  // Express
  config.port = process.env.PORT || 8080;
  config.expressLogging = process.env.EXPRESS_LOGGING || false;

  // Secrets
  config.sessionSecret = process.env.SESSION_SECRET || 'SESSION_SECRET';
  config.tokenSecret = process.env.TOKEN_SECRET || 'TOKEN_SECRET';
  config.jwtSecret = process.env.JWT_SECRET || 'JWT_SECRET';

  // Steam Passport
  config.steamReturnUrl = process.env.STEAM_RETURN_URL || 'STEAM_RETURN_URL';
  config.steamRealm = process.env.STEAM_REALM || 'STEAM_REALM';
  config.steamApiKey = process.env.STEAM_API_KEY || 'STEAM_API_KEY';

  // MongoDB
  config.dbUrl = process.env.DB_URL || 'DB_URL';
}

module.exports = config;