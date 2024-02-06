const express = require('express');
const app = express();

const connectDB = require('./db/connectdb');
require("./models/Registration");
const router = require('./routes/rigistrationRoute');

const PORT = process.env.PORT || 3000

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017";
// Database connection
connectDB(DATABASE_URL);

// load Routes
app.use("/", router)

app.get('/', (req, res) => {
    res.json({success: true, message: "welcome to backend zone!"})
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})