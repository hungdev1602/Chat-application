const chatRoute = require("./chat.route")
const userRoute = require("./user.route")

const userMiddleware = require("../../middlewares/client/user.middleware")

module.exports.index = (app) => {
  app.use(userMiddleware.infoUser)

  app.use("/", chatRoute)

  app.use('/user', userRoute)
}
