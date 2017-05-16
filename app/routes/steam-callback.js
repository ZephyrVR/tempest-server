module.exports = (req, res) => {
  res.redirect(req.session.redirect || '/profile');
  delete req.session.redirect;
};