const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
  _io.once("connection", (socket) => {
    console.log("Có 1 user kết nối!", socket.id);

    // Lấy tin nhắn từ client gửi cho server, sau đó lưu vào database
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const dataChatForSave = {
        userId: res.locals.user.id,
        content: data.message
      }

      // lưu tin nhắn vào database
      const newChat = new Chat(dataChatForSave)
      await newChat.save();

      // Trả tin nhắn đó về cho tất cả các máy 
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: res.locals.user.id,
        fullName: res.locals.user.fullName,
        content: data.message,
      })
    })

    // Lắng nghe sự kiện khi người dùng đang typing
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.emit("SERVER_SEND_TYPING", {
        userId: res.locals.user.id,
        fullName: res.locals.user.fullName,
        type: type
      })
    })
  });

  // Lấy ra tin nhắn mặc định từ database
  const chats = await Chat.find({
    deleted: false
  })

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.userId
    })
    
    chat.fullName = infoUser.fullName
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Chat App",
    chats: chats
  });
}