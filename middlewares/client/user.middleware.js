module.exports.requireAuth = (req, res, next) => {
  if (!req.cookies.tokenUser) {
    req.flash('error', 'Vui lòng đăng nhập');
    res.redirect('/user/login');
    return;
  }
  next();
}

