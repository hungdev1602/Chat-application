const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

// nhúng file route
const routeClient = require("./routes/client/index.route");

app.set('view engine', 'pug'); // Thiết lập template engine PUG
app.set('views', `${__dirname}/views`); // Khi render các file view template, sẽ tìm đến file views

app.use(express.static(`${__dirname}/public`)); // Thiết lập thư mục chứa file tĩnh (CSS, JS, images của bên FE)

// truyền app qua bên route
routeClient.index(app)

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});