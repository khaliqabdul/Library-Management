const express = require("express");
const bookRouter = express.Router();
const bodyParser = require("body-parser");

const bookController = require("../controllers/bookController");

// bookRouter.use(express.json())
bookRouter.use(bodyParser.json());
bookRouter.use(bodyParser.urlencoded({ extended: true, parameterLimit: 1000000, limit: "5000mb"}));
// bookRouter.use(bodyParser.text({ limit: '10000mb' }));

bookRouter.post("/addBook", bookController.addBook);
bookRouter.get("/booksList", bookController.booksList);
bookRouter.post("/deleteBook", bookController.deleteBook)

module.exports = bookRouter;
