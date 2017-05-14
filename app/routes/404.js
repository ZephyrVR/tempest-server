var config = require('../../config/config');

module.exports = (req, res) => {
  res.status(404).render('error.ejs', {
    code: '404',
    message: 'Looks like you\'re lost.',
    environment: config.environment
  });
};