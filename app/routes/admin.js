var App = require('../../app/models/app');
var User = require('../../app/models/user');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = (req, res) => {
	User.find({}, function(err, users) {
		App.find({}).populate('developer').exec(function(err, apps) {
		  res.render('admin.ejs', {
		    user: req.user,
		    users: users,
		    apps: apps
		  });
		});
	});
};