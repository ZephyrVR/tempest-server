var config = require('../config/config');
var cors = require('cors');

var App = require('../app/models/app');

module.exports = function(app, passport) {
  app.get('/', requireLogout, require('./routes/index'));

  app.get('/auth/steam', passport.authenticate('steam'), require('./routes/empty'));

  app.get('/auth/steam/callback', passport.authenticate('steam', { failureRedirect: '/login' }), require('./routes/steam-callback.js'));

  app.get('/profile', requireLogin, require('./routes/profile'));

  app.get('/help', requireLogin, require('./routes/help'));

  app.get('/developer', requireLogin, require('./routes/developer'));

  app.get('/admin', requireLogin, requireAdmin, require('./routes/admin'));

  app.get('/revoke/:id', requireLogin, require('./routes/revoke'));

  app.get('/logout', require('./routes/logout'));

  // API

  app.get('/api/v2/:id', cors(), requireApiKey, require('./routes/api/v2/root'));

  app.get('/api/v2/:id/login', cors(), requireApiKey, require('./routes/api/v2/login'), passport.authenticate('steam'));

  app.get('/api/v2/:id/result', cors(), requireApiLogin, require('./routes/api/v2/result'));

  app.post('/api/v2/:id/verify', cors(), requireApiKeyJson, require('./routes/api/v2/verify'));

  app.use(require('./routes/404'));
};

// If not logged in, go to index
function requireLogin(req, res, next) {
  if (req.isAuthenticated())
    return next();

  req.flash('error', 'You need to login first.');
  res.redirect('/');
}

// If logged in, go to profile
function requireLogout(req, res, next) {
  if (!req.isAuthenticated())
    return next();

  res.redirect('/profile');
}

// If not admin, go to profile
function requireAdmin(req, res, next) {
  if (req.user.admin)
    return next();

  req.flash('error', 'You don\'t have permission to view that page.');
  res.redirect('/profile');
}

// If not logged in, go to API error page
function requireApiLogin(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.status(401).render('apierror.ejs', {
    error: 'User not logged in',
    environment: config.environment
  });
}

// Check provided API key, continue if valid (HTML errors)
function requireApiKey(req, res, next) {
  var apiKey = req.headers.authorization;
  if (!apiKey) {
    res.status(401).render('apierror.ejs', {
      error: 'Missing API key',
      environment: config.environment
    });
  } else {
    App.findOne({ 'apiKey': apiKey }, function(err, app) {
      if (err)
        return done(err);

      if (!app || app.publicId != req.params['id']) {
        res.status(401).render('apierror.ejs', {
          error: 'Invalid API key',
          environment: config.environment
        });
      } else {
        next();
      }
    });
  }
}

// Check provided API key, continue if valid (JSON errors)
function requireApiKeyJson(req, res, next) {
  var apiKey = req.headers.authorization;
  if (!apiKey) {
    res.status(401).json({
      error: "Invalid API key"
    });
  } else {
    App.findOne({ 'apiKey': apiKey }, function(err, app) {
      if (err)
        return done(err);

      if (!app || app.publicId != req.params['id']) {
        res.status(401).json({
          error: "Invalid API key"
        });
      } else {
        next();
      }
    });
  }
}
