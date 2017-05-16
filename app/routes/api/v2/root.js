var config = require('../../../../config/config');

var App = require('../../../../app/models/app');

module.exports = (req, res) => {
  App.findOne({ 'publicId': req.params['id'] }, function(err, app) {
    if (err)
      return done(err);

    if (!app) {
      res.status(400).render('apierror.ejs', {
        error: 'Invalid App ID',
        environment: config.environment
      });
    } else {
      res.render('applogin.ejs', {
        id: app.publicId,
        name: app.name,
        type: app.type,
        environment: config.environment
      });
    }
  });
};