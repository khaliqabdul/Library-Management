const express = require('express')
const readerRouter = express.Router();
const bodyParser = require('body-parser')
const authToken = require('../middleware/authToken');

const readerController = require("../controllers/readerController")

readerRouter.use(bodyParser.json())
readerRouter.use(bodyParser.urlencoded({extended: true}))
// routes
readerRouter.post('/addReader', authToken, readerController.createNewReader);
readerRouter.post("/getAllReaders", authToken, readerController.getAllReaders);
readerRouter.post("/deleteReader", authToken, readerController.deleteReader);
// readerRouter.get("/blacklisted", authToken, readerController.getBlacklistedReader);

module.exports = readerRouter