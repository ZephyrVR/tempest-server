var SteamStrategy = require('passport-steam').Strategy;
var User = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new SteamStrategy({
        returnURL: configAuth.steamAuth.returnURL,
        realm: configAuth.steamAuth.realm,
        apiKey: configAuth.steamAuth.apiKey
      },
      function(identifier, profile, done) {
        process.nextTick(function() {
            User.findOne({'steam.id' : profile._json.steamid}, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    user.steam.name = profile._json.personaname;
                    user.steam.avatar = profile._json.avatarfull;

                    user.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                } else {
                    var newUser = new User();

                    newUser.admin = false;

                    newUser.steam.id = profile._json.steamid;
                    newUser.steam.name = profile._json.personaname;
                    newUser.steam.avatar = profile._json.avatarfull;

                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            })
        })
      }
    ));
};