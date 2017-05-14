module.exports = (req, res, next) => {
  req.session.redirect = '/api/v2/' + req.params['id'] + '/result';
  next();
};