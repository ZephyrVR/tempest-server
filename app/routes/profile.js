var App = require('../../app/models/app');
var Token = require('../../app/models/token');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = (req, res) => {
	Token.find({ 'user': req.user._id }, function(err, tokens) {
    if (err)
      return done(err);

    var mongooseAppIds = [];
    for (var x = 0; x < tokens.length; x++) {
      mongooseAppIds.push(new ObjectId(tokens[x].app));
    }

    App.find({
      '_id': { $in: mongooseAppIds }
    }, function(err, apps) {
      var sanitizedApps = [];
      for (var x = 0; x < apps.length; x++) {
        sanitizedApps.push({
          id: apps[x].publicId,
          name: apps[x].name,
          type: apps[x].type
        });
      }

      res.render('profile.ejs', {
        user: req.user,
        apps: sanitizedApps,
        infoMsgs: req.flash('info'),
        errorMsgs: req.flash('error')
      });
    });
  });
};