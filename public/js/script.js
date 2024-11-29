import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

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

// Show Emoji
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker){
  emojiPicker.addEventListener('emoji-click', event => {
    const inputChat = document.querySelector('.chat .inner-form input[name="content"]');
    inputChat.value = inputChat.value + event.detail.unicode
  });
}
// End Show Emoji

// Toolip
const buttonIcon = document.querySelector(".chat .inner-form .button-icon");
const tooltip = document.querySelector('.tooltip')
if(buttonIcon){
  Popper.createPopper(buttonIcon, tooltip)

  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle('shown')
  })
  // close tooltip outside tooltip
  window.addEventListener('click', function(e){   
    if (!(tooltip.contains(e.target)) && !buttonIcon.contains(e.target)){
      tooltip.classList.remove('shown')
    } 
  });
}

// End Toolip

// End Socket.io