const express = require('express')
const readerRouter = express.Router();
const bodyParser = require('body-parser')
const authToken = require('../middleware/authToken');

const readerController = require("../controllers/readerController")

readerRouter.use(bodyParser.json())
readerRouter.use(bodyParser.urlencoded({extended: true}))
// routes
readerRouter.post('/reader', readerController.createNewReader);
readerRouter.post("/getAllReaders", readerController.getAllReaders);
// readerRouter.get("/", authToken, readerController.getAllReaders);
// readerRouter.get("/blacklisted", authToken, readerController.getBlacklistedReader);

module.exports = readerRouter