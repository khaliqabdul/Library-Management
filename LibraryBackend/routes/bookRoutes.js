const express = require("express");
const bookRouter = express.Router();
const bodyParser = require("body-parser");
const authToken = require("../middleware/authToken")

const bookController = require("../controllers/bookController");

// bookRouter.use(express.json())
bookRouter.use(bodyParser.json());
bookRouter.use(bodyParser.urlencoded({ extended: true, parameterLimit: 1000000, limit: "5000mb"}));
// bookRouter.use(bodyParser.text({ limit: '10000mb' }));

bookRouter.post("/addBook", authToken, bookController.addBook);
bookRouter.post("/booksList",authToken, bookController.booksList);
bookRouter.post("/deleteBook",authToken, bookController.deleteBook);
bookRouter.post("/lendBook", bookController.setAsLended);
bookRouter.post("/returnBook", bookController.setAsReturned);

module.exports = bookRouter;
