var App = require('../../app/models/app');

module.exports = (req, res) => {
  var action = req.params['action'];

  if (!action) {
    // Missing action
    res.redirect('/admin');
    return;
  }

  App.findOne({ publicId: req.params['id'] }, function(err, app) {
    if (!app) {
      // Invalid app ID
      res.redirect('/admin');
      return;
    }

    if (action == 'set-data') {
      app.name = req.body.appName;
      app.apiKey = req.body.apiKey;
      app.save(function(err) { });
    } else if (action == 'set-unverified') {
      app.type = 0;
      app.save(function(err) { });
    } else if (action == 'set-verified') {
      app.type = 1;
      app.save(function(err) { });
    } else if (action == 'set-official') {
      app.type = 2;
      app.save(function(err) { });
    } else if (action == 'disable') {
      app.type = 3;
      app.save(function(err) { });
    } else if (action == 'delete') {
      app.remove(function(err) { });
    }
  });

  res.redirect('/admin');
}