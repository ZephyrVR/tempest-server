var App = require('../app/models/app');
var Token = require('../app/models/token');
var User = require('../app/models/user');
var ObjectId = require('mongoose').Types.ObjectId;
var config   = require('../config/config');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const uuidV4 = require('uuid/v4');

module.exports = function(app, passport) {

    app.get('/', requireLogout, function(req, res) {
        res.render('index.ejs', {
            infoMsgs: req.flash('info'),
            errorMsgs: req.flash('error')
        });
    });

    app.get('/auth/steam', passport.authenticate('steam'), function(req, res) {});

    app.get('/auth/steam/callback', passport.authenticate('steam', { failureRedirect: '/login' }), function(req, res) {
        res.redirect(req.session.redirect || '/profile');
        delete req.session.redirect;
    });

    app.get('/api/v2/:id', requireApiKey, function(req, res) {
        App.findOne({'publicId' : req.params['id']}, function(err, app) {
            if (err)
                return done(err);

            if(!app) {
                res.status(400).render('apierror.ejs', {
                    error: 'Invalid App ID'
                });
            } else {
                res.render('applogin.ejs', {
                    id: app.publicId,
                    name: app.name,
                    type: app.type
                });
            }
        });
    });

    app.get('/api/v2/:id/login', requireApiKey, function(req, res, next) {
        req.session.redirect = '/api/v2/' + req.params['id'] + '/result';
        next();
    }, passport.authenticate('steam'));

    app.get('/api/v2/:id/result', requireApiLogin, function(req, res) {
        var hmac = crypto.createHmac('sha1', config.tokenSecret);
        hmac.write(JSON.stringify(req.user._id));
        hmac.end();

        App.findOne({'publicId' : req.params['id']}, function(err, app) {
            if (err)
                return done(err);

            if (!app) {
                res.status(400).render('apierror.ejs', {
                    error: 'Invalid App ID'
                });
            } else {
                Token.findOne({'app': app._id, 'user': req.user._id}, function(err, token) {
                    if (err)
                        return done(err);

                    if(!token) {
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
    });

    app.post('/api/v2/:id/verify', requireApiKeyJson, function(req, res) {
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

        Token.findOne({'appId': req.params['id'], 'token': t}, function(err, token) {
            if (err)
                return done(err);

            if(!token) {
                res.json({
                    valid: false
                });
            } else {
                User.findOne({'_id': new ObjectId(token.user)}, function(err, user) {
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
    });

    app.get('/profile', requireLogin, function(req, res) {
        Token.find({'user': req.user._id}, function(err, tokens) {
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
    });

    app.get('/revoke/:id', requireLogin, function(req, res) {
        Token.find({user: req.user._id, appId: req.params['id']}).remove(function(err) {
            console.log(err);
            if (!err) {
                req.flash('error', 'Error encountered when revoking app access.');
            }
            res.redirect('/profile');
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.use(function(req, res) {
        res.status(404).render('error.ejs', {
            code: '404',
            message: 'Looks like you\'re lost.'
        });
    });
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

// If not logged in, go to API error page
function requireApiLogin(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.status(401).render('apierror.ejs', {
        error: "User not logged in"
    });
}

// Check provided API key, continue if valid (HTML errors)
function requireApiKey(req, res, next) {
    var apiKey = req.headers.authorization;
    if(!apiKey) {
        res.status(401).render('apierror.ejs', {
            error: 'Missing API key'
        });
    } else {
        App.findOne({'apiKey' : apiKey}, function(err, app) {
            if (err)
                return done(err);

            if(!app || app.publicId != req.params['id']) {
                res.status(401).render('apierror.ejs', {
                    error: 'Invalid API key'
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
    if(!apiKey) {
        res.status(401).json({
            error: "Invalid API key"
        });
    } else {
        App.findOne({'apiKey' : apiKey}, function(err, app) {
            if (err)
                return done(err);

            if(!app || app.publicId != req.params['id']) {
                res.status(401).json({
                    error: "Invalid API key"
                });
            } else {
                next();
            }
        });
    }
}