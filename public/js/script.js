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
  const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
    multiple: true, // up nhiều ảnh
    maxFileCount: 6 // tôi đa 6 ảnh
  });

  formChat.addEventListener("submit", (event) => {
    event.preventDefault();

    // Lấy được tin nhắn từ form và gửi cho server tin nhắn đó thông qua socket
    const message = formChat.content.value
    // Lấy ảnh của người dùng
    const images = upload.cachedFileArray || []
    // phải có tin nhắn hoặc hình ảnh
    if(message || images.length > 0){
      const data = {
        message: message,
        images: images
      }
      socket.emit("CLIENT_SEND_MESSAGE", data)
      formChat.content.value = ""
      upload.resetPreviewPanel(); // clear all selected images
      // gửi tin nhắn xong và xoá typing
      socket.emit("CLIENT_SEND_TYPING", false)
    }
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
    // inner_body.appendChild(div)
    const listTyping = document.querySelector(".chat .inner-list-typing");
    inner_body.insertBefore(div, listTyping) // insert trước block list-typing
  }
  else{
    div.classList.add("inner-incoming")
    let fullName = `
      <div class="inner-name">${data.fullName}</div>
      <div class="inner-content">${data.content}</div>
    `
    div.innerHTML = fullName
    // inner_body.appendChild(div)
    const listTyping = document.querySelector(".chat .inner-list-typing");
    inner_body.insertBefore(div, listTyping) // insert trước block list-typing
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
    // không ấn vào tooltip(vào icon) với buttonIcon
    if (!(tooltip.contains(e.target)) && !buttonIcon.contains(e.target)){
      tooltip.classList.remove('shown')
    } 
  });
}

// End Toolip

// Typing
const inputChat = document.querySelector(".chat .inner-form input[name='content']");

var timeOut;
if(inputChat){
  inputChat.addEventListener("keydown", () => {
    socket.emit("CLIENT_SEND_TYPING", true)

    clearTimeout(timeOut)

    timeOut = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", false)
    }, 3000)
  })
}

const elementListTyping = document.querySelector(".inner-list-typing");
if(elementListTyping){
  
  // SERVER_SEND_TYPING
  socket.on("SERVER_SEND_TYPING", (data) => {
    if(data.type){
      // điều kiện này để check có tồn tại typing chưa, nếu chưa thì mới add vào
      const existBoxTyping = elementListTyping.querySelector(`.box-typing[my-id="${data.userId}"]`)
      if(!existBoxTyping){
        const div = document.createElement("div")
        div.classList.add("box-typing")
        div.setAttribute("my-id", data.userId)
        div.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        `
        elementListTyping.appendChild(div)
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    }
    else{
      const existBoxTyping = elementListTyping.querySelector(`.box-typing[my-id="${data.userId}"]`)
      if(existBoxTyping){
        elementListTyping.removeChild(existBoxTyping)
      }
    }
  })
  // End SERVER_SEND_TYPING
}
  
// End Typing

// End Socket.io