var config = require('../../../../config/config');
var crypto = require('crypto');
const uuidV4 = require('uuid/v4');

var App = require('../../../../app/models/app');
var Token = require('../../../../app/models/token');

module.exports = (req, res) => {
  var hmac = crypto.createHmac('sha1', config.tokenSecret);
  hmac.write(JSON.stringify(req.user._id));
  hmac.end();

  App.findOne({ 'publicId': req.params['id'] }, function(err, app) {
    if (err)
      return done(err);

    if (!app) {
      res.status(400).render('apierror.ejs', {
        error: 'Invalid App ID',
        environment: config.environment
      });
    } else {
      Token.findOne({ 'app': app._id, 'user': req.user._id }, function(err, token) {
        if (err)
          return done(err);

        if (!token) {
          var newToken = new Token();

          newToken.token = uuidV4();
          newToken.app = app._id;
          newToken.appId = app.publicId;
          newToken.user = req.user._id;

          newToken.save(function(err) {
            if (err)
              throw err;
          });

          var result = {
            name: req.user.steam.name,
            avatar: req.user.steam.avatar,
            room: hmac.read().toString('hex'),
            token: newToken.token
          };
          res.json(result);
        } else {
          var result = {
            name: req.user.steam.name,
            avatar: req.user.steam.avatar,
            room: hmac.read().toString('hex'),
            token: token.token
          };
          res.json(result);
        }
      });
    }
  });
};