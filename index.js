const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Sử dụng .env
require("dotenv").config();
const flash = require('express-flash');
const cookieParser = require('cookie-parser')
const session = require('express-session')

const bodyParser = require('body-parser')

// nhúng thư viện express-flash để hiện thỉ thông báo
// phải cài thêm 2 thư viện cookie-parser và express-session
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Kết nối database
const database = require('./config/database');
database.connect();

// nhúng file route
const routeClient = require("./routes/client/index.route");

app.set('view engine', 'pug'); // Thiết lập template engine PUG
app.set('views', `${__dirname}/views`); // Khi render các file view template, sẽ tìm đến file views

app.use(express.static(`${__dirname}/public`)); // Thiết lập thư mục chứa file tĩnh (CSS, JS, images của bên FE)

// truyền app qua bên route
routeClient.index(app)

io.on("connection", (socket) => {
  console.log("Có 1 user kết nối!", socket.id);
});

server.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});