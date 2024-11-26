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

// Nhận tin nhắn từ server trả về và add vào giao diện
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const chat = document.querySelector(".chat")
  const inner_body = chat.querySelector(".inner-body")
  const userId = chat.getAttribute("my-id")

  const div = document.createElement("div")
  if(data.userId === userId){
    div.classList.add("inner-outgoing")
    div.innerHTML = `<div class="inner-content">${data.content}</div>`
    inner_body.appendChild(div)
  }
  else{
    div.classList.add("inner-incoming")
    let fullName = `
      <div class="inner-name">${data.fullName}</div>
      <div class="inner-content">${data.content}</div>
    `
    div.innerHTML = fullName
    inner_body.appendChild(div)
  }

  inner_body.scrollTop = inner_body.scrollHeight;
})

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll Chat To Bottom

// End Socket.io