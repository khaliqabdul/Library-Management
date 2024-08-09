const mongoose = require("mongoose");
const Book = require("../models/bookModal");
const User = mongoose.model("Registration");
const ObjectId = require("mongodb").ObjectId;

global.io.on("connection", (socket) => {
  console.log("socket connected in book controllers!");

  // listen from addBook.js
  socket.on("add_book", async function (data) {
    // var _id = new ObjectId(data.registration_id);
    // const user = await User.findById({ _id }).populate("reader_id");
  });
});

// add book
const addBook = async (req, res) => {
  const { registration_id, bookTitle, author, genre, price, image } = req.body;
  // console.log("body",req.body)
  if (!registration_id)
    return res
      .status(401)
      .json({ success: false, message: "unauthorize access!" });

  try {
    const book = new Book({
      bookTitle,
      author,
      genre,
      price,
      image,
    });
    const bookData = await book.save();
    // send data to BooksList component
    const booksList = await Book.find();
    io.emit("send_booksList", booksList);

    res.send({
      success: true,
      message: `book ${bookData.bookTitle} added successfully!`,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(422).send({ success: false, message: error.message });
  }
};

// Books List
const booksList = async (req, res) => {
  try {
    const booksList = await Book.find();
    res.send({
      success: true,
      message: "Books Populated successfully!",
      booksList,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(422).send({ success: false, message: error.message });
  }
};
// delete Book
const deleteBook = async (req, res) => {
  const data = req.body;
  const id = data.bookId;
  const registration_id = data.registration_id;
  try {
    const deletedBook = await Book.findByIdAndDelete({ _id: id }, { new: true });
    if(deletedBook){
      const newBooksList = await Book.find()
      // lesten in BooksList component
      io.emit("send_booksList", newBooksList);

      res.send({
        success: true,
        message: `Book ${deletedBook.bookTitle} deleted successfully!`,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(422).send({ success: false, message: error.message });
  }
};

module.exports = {
  addBook,
  booksList,
  deleteBook,
};
