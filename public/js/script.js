// Tắt thông báo alert message sau 3s
const alertMessage = document.querySelector("[alert-message]")
if(alertMessage){
  setTimeout(() => {
    alertMessage.style.display = "none"
  }, 3000)
}
// Hết Tắt thông báo alert message sau 3s

// Socket.io
var socket = io();

const formChat = document.querySelector(".inner-form");
if(formChat){
  formChat.addEventListener("submit", (event) => {
    event.preventDefault();

    // Lấy được tin nhắn từ form và gửi cho server tin nhắn đó thông qua socket
    const message = formChat.content.value
    const data = {
      message: message
    }
    socket.emit("CLIENT_SEND_MESSAGE", data)
    formChat.content.value = ""
  });
}

// Nhận tin nhắn từ server trả về
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  console.log(data)
})

// End Socket.io