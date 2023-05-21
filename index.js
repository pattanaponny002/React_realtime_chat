const express = require("express");

const app = express();

const dotenv = require("dotenv");

const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const server = http.createServer(app); // puting app in
const cookie_parser = require("cookie-parser");

// mongoose model
const mongoose = require("mongoose");
const user_api = require("./routers/user");
const conversation_api = require("./routers/conversation");
const message_api = require("./routers/message");
const parser = require("socket.io-msgpack-parser");
const port = 4000;
dotenv.config();
mongoose
  .connect("mongodb://localhost:27017/master", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("conntected DB"));
let users = [];

function addUSer(userId, socketId) {
  console.log("id", userId, "user", users);
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
}
function removeUSer(userId) {
  users = users.filter((user) => user.userId !== userId);
}
function getUser(userId) {
  return users.find((user) => user.userId === userId);
}

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cookie_parser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://admin.socket.io/#/"],
    methods: ["GET", "POST"],
  })
);

io.on("connection", (socket) => {
  // console.log("user connnected ", socket.id);

  // onlineUsers
  // socket.on("addUser", (user) => {
  //   console.log("a user disconnnected", user._id);
  //   addUSer(user._id, socket.id);
  //   ////
  //   io.emit("getUsers", users);
  // });

  socket.on("addFreind", (text) => {
    //receiver
    io.emit("getFriend", {
      text,
    });
  });
  socket.on("sendMessage", (text) => {
    //receiver
    io.emit("getMessage", {
      text,
    });
  });
});

app.use("/user/api", user_api);
app.use("/conversation/api", conversation_api);
app.use("/message/api", message_api);

///server for socket.io
server.listen(port, console.log("Server is running on port ", port));
