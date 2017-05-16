var App = require('../../app/models/app');

module.exports = (req, res) => {
  var newApp = new App();

  newApp.apiKey = req.body.apiKey;
  newApp.name = req.body.appName;
  newApp.developer = req.user._id;
  newApp.type = getAppType(req.body.appType);

  newApp.save(function(err) {
    if (err)
      throw err;
    res.redirect('/admin');
  });
};

function getAppType(appType) {
  if (appType >= 0 && appType <= 2) {
    return parseInt(appType);
  } else {
    return 0;
  }
}