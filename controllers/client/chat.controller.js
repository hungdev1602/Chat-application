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