const homeRoute = require("./home.route")

module.exports.index = (app) => {
  app.use("/", homeRoute)
}