var config = require('../../config/config');

module.exports = (req, res) => {
  res.render('index.ejs', {
    infoMsgs: req.flash('info'),
    errorMsgs: req.flash('error'),
    environment: config.environment
  });
};