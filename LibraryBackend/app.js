const express = require("express");
const app = express();
var cors = require("cors");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
global.io = io;

const connectDB = require("./db/connectdb");
 require("./models/Registration");
const router = require("./routes/rigistrationRoute");
const readerRouter = require("./routes/readerRoutes");

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

const corsOrigin = {
  origin: "http://localhost:19006", //or whatever port your frontend is using
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOrigin));

const books = [
  {
    id: 100,
    title: "Golang experts",
    author: "John Stack",
    price: 200,
  },
  {
    id: 101,
    title: "C++ for beginners",
    author: "John Doe",
    price: 250,
  },
  {
    id: 102,
    title: "Flutter development",
    author: "Steven Doe",
    price: 350,
  },
  {
    id: 103,
    title: "JavaScript internals",
    author: "John Stack",
    price: 300,
  },
];

app.get("/books", (req, res) => {
  res.json(books);
});

// socket
io.on("connection", (socket) => {
  console.log("socket connected! in app");

  socket.on("send_message", (msg) => {
    io.emit("receive_message", msg);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
