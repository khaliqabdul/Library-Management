const express = require("express");
const app = express();
var cors = require("cors");

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
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers","Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  next();
});
// Content-Type, Accept, authorization
// load Routes
app.use("/", router);
app.use("/", readerRouter);

const corsOrigin = {
  origin: "http://localhost:19006", //or whatever port your frontend is using
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOrigin));

// Testing
app.post("/reader", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  try {
    console.log("body", req.body);
    res.send({ success: true, message: "welcome to backend zone!" });
  } catch (error) {
    console.log(error.message);
    return res.status(422).send(error.message);
  }
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "welcome to backend zone!" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
