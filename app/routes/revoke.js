var Token = require('../../app/models/token');

module.exports = (req, res) => {
  Token.find({ user: req.user._id, appId: req.params['id'] }).remove(function(err) {
    if (!err) {
      req.flash('error', 'Error encountered when revoking app access.');
    }
    res.redirect('/profile');
  });
};