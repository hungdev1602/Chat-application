const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

app.set('view engine', 'pug'); // Thiết lập template engine PUG
app.set('views', `${__dirname}/views`); // Khi render các file view template, sẽ tìm đến file views

app.use(express.static(`${__dirname}/public`)); // Thiết lập thư mục chứa file tĩnh (CSS, JS, images của bên FE)

app.get("/", (req, res) => {
  res.render("client/pages/chat/index", {
    pageTitle: "Chat App"
  });
})

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});