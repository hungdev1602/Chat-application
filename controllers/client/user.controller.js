const User = require("../../models/user.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate.helper")

module.exports.register = (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản"
  });
}

module.exports.registerPost = async (req, res) => {
  const user = req.body;

  const existUser = await User.findOne({
    email: user.email,
    deleted: false
  })
  // Check xem email đăng ký tồn tại hay chưa
  if (existUser) {
    req.flash("error", "email đã tồn tại trong hệ thống")
    res.redirect("back")
    return;
  }

  const dataUserForSave = {
    ...user,
    password: md5(user.password),
    token: generateHelper.generateRandomString(30),
    status: "active"
  }

  const newUser = new User(dataUserForSave)
  await newUser.save()

  res.cookie("tokenUser", newUser.token)

  req.flash("success", "Đăng ký tài khoản thành công!");

  res.redirect("/")
}

module.exports.login = (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập"
  })
}

module.exports.loginPost = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const user = await User.findOne({
    email: email,
    deleted: false
  })

  if(!user){
    req.flash("error", "Email không tồn tại trong hệ thống")
    res.redirect("back")
    return
  }

  if(md5(password) !== user.password){
    req.flash("error", "Sai mật khẩu")
    res.redirect("back")
    return
  }

  if(user.status !== "active"){
    req.flash("error", "Tài khoản bị khoá")
    res.redirect("back")
    return
  }

  res.cookie("tokenUser", user.token)
  req.flash("success", "Đăng nhập thành công")

  res.redirect("/")
}