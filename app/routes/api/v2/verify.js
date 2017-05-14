var config = require('../../../../config/config');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var ObjectId = require('mongoose').Types.ObjectId;

var Token = require('../../../../app/models/token');

module.exports = (req, res) => {
  var t = req.body['token'];
  var device = req.body['device'];

  if (!t) {
    res.status(400).json({
      error: "Missing token"
    });
  }

  if (!device) {
    res.status(400).json({
      error: "Missing device"
    });
  }

  Token.findOne({ 'appId': req.params['id'], 'token': t }, function(err, token) {
    if (err)
      return done(err);

    if (!token) {
      res.json({
        valid: false
      });
    } else {
      User.findOne({ '_id': new ObjectId(token.user) }, function(err, user) {
        if (err)
          return done(err);

        if (user) {
          var hmac = crypto.createHmac('sha1', config.tokenSecret);
          hmac.write(JSON.stringify(user._id));
          hmac.end();

          var jwtToken = jwt.sign({
            user: user.steam.name,
            device: device,
            room: hmac.read().toString('hex'),
          }, config.jwtSecret, {
            expiresIn: "15m"
          });

          res.json({
            valid: true,
            jwtToken: jwtToken,
            user: {
              name: user.steam.name,
              avatar: user.steam.avatar
            }
          });
        } else {
          res.json({
            valid: false
          });
        }
      });
    }
  });
};