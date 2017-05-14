module.exports = (req, res) => {
  res.render('dev.ejs', {
    user: req.user
  });
};