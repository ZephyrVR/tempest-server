console.log('Starting to update users from Steam...');

var config = require('../config/config');
var mongoose = require('mongoose');
var request = require('request');
var Promise = require('promise');
var User = require('../app/models/user');

mongoose.Promise = global.Promise;

var userCount = 0;

// See: https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29
const STEAM_ENDPOINT = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/';

// Connect to database
mongoose.connect(config.dbUrl);

// Start updating users
main().then(function() {
  console.log('Successfully updated ' + userCount + ' users.');
  process.exit();
}, function(err) {
  console.log('Error: ' + err);
  process.exit();
});

// Used to split `arr` into groups of `chunkSize`
var createGroupedArray = function(arr, chunkSize) {
  var groups = [],
    i;
  for (i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize));
  }
  return groups;
}

// Get all users from the database and split into chunks of 100 before querying Steam
function main() {
  return new Promise(function(fulfill, reject) {
    User.find({}, function(err, users) {
      if (err) {
        reject(err);
      }

      var chunks = createGroupedArray(users, 100);
      var chunkIds = [];

      chunks.forEach(function(chunk) {
        var ids = '';

        chunk.forEach(function(user) {
          ids += user.steam.id + ',';
        });

        ids = ids.substring(0, ids.length - 1);

        chunkIds.push(ids);
      });

      Promise.all(chunkIds.map(requestUserData)).then(function(response) {
        var promises = [];
        var index = 0;

        response.forEach(function(res) {
          promises.push(updateUserData(chunks[index], res));
          index++;
        });

        Promise.all(promises).then(function(response) {
          fulfill();
        }, function(err) {
          reject(err);
        });
      }, function(err) {
        reject(err);
      });
    });
  });
}

// Get user data from Steam
function requestUserData(ids) {
  return new Promise(function(fulfill, reject) {
    var url = STEAM_ENDPOINT + '?key=' + config.steamApiKey + '&steamids=' + ids;

    request(url, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        fulfill(JSON.parse(body).response.players);
      }
    });
  });
}

// Update user data from the Steam results
function updateUserData(users, queryResult) {
  return new Promise(function(fulfill, reject) {
    var index = 0;
    var usersToSave = [];

    users.forEach(function(user) {
      if (user.steam.id != queryResult[index].steamid) {
        reject('Mismatched Steam IDs (' + user.steam.id + ' != ' + queryResult[index].steamid + ')');
      }

      if (user.steam.name == queryResult[index].personaname && user.steam.avatar == queryResult[index].avatarfull) {
        console.log('No changes for ' + user.steam.id + ' detected.');
        index++;
        return;
      }

      console.log('Updating ' + user.steam.id);

      user.steam.name = queryResult[index].personaname;
      user.steam.avatar = queryResult[index].avatarfull;

      usersToSave.push(user.save());

      userCount++;
      index++;
    });

    // Wait for save operations to complete before continuing
    Promise.all(usersToSave).then(function(resultSaves) {
        fulfill(users);
      }).catch(function(err) {
          reject(err);
      });
  });
}
