const express = require("express");
const app = express();
var cors = require("cors");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // can connect all http requests
  },
});
global.io = io;

const connectDB = require("./db/connectdb");
require("./models/Registration");
require("./models/verificationOTP");
require("./models/resetPasswordToken");
require("./models/contactUsModal");
const router = require("./routes/rigistrationRoute");
const readerRouter = require("./routes/readerRoutes");
const bookRouter = require("./routes/bookRoutes");

const PORT = process.env.PORT || 3001;

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017";
// Database connection
connectDB(DATABASE_URL);

// added CORS header before all routes
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  next();
});

// load Routes
app.use("/", router);
app.use("/", readerRouter);
app.use("/", bookRouter);

const mobileUrl = "http://localhost:19006";

const corsOrigin1 = {
  origin: `${mobileUrl}`, //or whatever port your frontend is using
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors());

// socket
// io.on("connection", (socket) => {
//   console.log("socket connected! in app", socket.id);

//   socket.on("join room", (chatId) => {
//     socket.join(chatId)
//     console.log(`User ${socket.id} joined chat room ${chatId}`)
//   })

//   socket.on("send_message", (msg) => {
//     io.emit("receive_message", msg);
//     // io.to().emit()
//   });

//   socket.on("disconnect", () => {
//     console.log("socket disconnected...")
//   })
// });

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
