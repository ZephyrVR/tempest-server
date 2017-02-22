var config = require('./config');

module.exports = {
    'steamAuth' : {
        'returnURL': config.steamReturnUrl,
        'realm': config.steamRealm,
        'apiKey': config.steamApiKey
    }
};