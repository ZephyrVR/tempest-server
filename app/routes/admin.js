module.exports = (req, res) => {
  res.render('admin.ejs', {
    user: req.user
  });
};