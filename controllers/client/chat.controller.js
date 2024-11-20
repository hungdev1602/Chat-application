module.exports.index = (req, res) => {
  _io.on("connection", (socket) => {
    console.log("Có 1 user kết nối!", socket.id);
  });

  res.render("client/pages/chat/index", {
    pageTitle: "Chat App"
  });
}