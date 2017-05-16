module.exports = (req, res) => {
  res.render('help.ejs', {
    user: req.user
  });
};