const mongoose = require("mongoose");
const Book = require("../models/bookModal");
const User = mongoose.model("Registration");
const ObjectId = require("mongodb").ObjectId;
// socket io
global.io.on("connection", (socket) => {
  // console.log("socket connected in book controllers!");

  // create room
  socket.on("join room", (registration_id) => {
    socket.join(registration_id)
  })
  // listen from addBook.js
  socket.on("add_book", async function (registration_id) {
    var _id = new ObjectId(registration_id);
    const user = await User.findById({ _id }).populate("book_id");
    // send data to BooksList component
    io.to(registration_id).emit("send_booksList", user.book_id);
  });
});

// add book
const addBook = async (req, res) => {
  const { registration_id, bookTitle, author, genre, price, image } = req.body;
  // console.log(bookTitle)
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
    await User.findByIdAndUpdate(
      { _id: registration_id },
      {
        $push: { book_id: bookData._id },
      }
    );

    // const librarianData = await User.findById({
    //   _id: registration_id,
    // }).populate("book_id");
    // const booksList = librarianData.book_id;
    
    return res.send({
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
  const { id } = req.body;
  // console.log(id)
  if (!id)
    return res
      .status(401)
      .json({ success: false, message: "unauthorize access!" });

  try {
    const librarianData = await User.findById({ _id: id }).populate("book_id");
    const booksList = librarianData.book_id;

    return res.send({
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
  const { bookId } = data;
  const registration_id = data.registration_id;
  try {
    const deletedBook = await Book.findByIdAndDelete(
      { _id: bookId },
      { new: true }
    );
    // remove related book_id from User
    await User.updateOne(
      { _id: registration_id },
      { $pull: { book_id: bookId } }
    );

    if (deletedBook) {
      const librarianData = await User.findById({
        _id: registration_id,
      }).populate("book_id");
      const newBooksList = librarianData.book_id;
      // lesten in BooksList component
      io.to(registration_id).emit("delete_book", newBooksList);

      return res.send({
        success: true,
        message: `Book "${deletedBook.bookTitle}" deleted successfully!`,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(422).send({ success: false, message: error.message });
  }
};
// set As Lended
const setAsLended = async (req, res) => {
  const { bookId, reg_id } = req.body;
  // console.log("updated book id", bookId);
  let updates = {
    $push: {
      lendingHistory: {
        lendedOn: new Date(),
        lendedById: req.body.lenderId,
        lendedByName: req.body.lenderName,
      },
    },
  };
  try {
    const lendBook = await Book.findByIdAndUpdate({ _id: bookId }, updates, {
      new: true,
    });
    if (lendBook) {
      const librarianData = await User.findById({ _id: reg_id }).populate(
        "book_id"
      );
      const newBooksList = librarianData.book_id;
      // listen in BooksList component
      io.to(reg_id).emit("send_booksList", newBooksList);
      // listen in BookLendingHistory component
      io.to(reg_id).emit("sendTo_bookDetail", lendBook.lendingHistory);
      const currentLender = lendBook.lendingHistory.pop();
      return res.send({
        success: true,
        message: `Book lended to ${currentLender.lendedByName} successfully!`,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(422).send({ success: false, message: error.message });
  }
};
// set as returned
const setAsReturned = async (req, res) => {
  const { reg_id, bookId } = req.body;
  let updates = {
    $set: {
      "lendingHistory.$.returnedOn": new Date(),
    },
  };
  let query = {
    _id: bookId,
    "lendingHistory.lendedById": req.body.lenderId,
    "lendingHistory.returnedOn": null,
  };
  try {
    const returnBook = await Book.findOneAndUpdate(query, updates, {
      new: true,
    });

    if (returnBook) {
      const librarianData = await User.findById({ _id: reg_id }).populate(
        "book_id"
      );
      const newBooksList = librarianData.book_id;
      // lesten in BooksList component
      io.to(reg_id).emit("send_booksList", newBooksList);
      // listen in BookLendingHistory component
      io.to(reg_id).emit("sendTo_bookDetail", returnBook.lendingHistory);
      const lastReader = returnBook.lendingHistory.pop();
      return res.send({
        success: true,
        message: `Book returned by ${lastReader.lendedByName} successfully!`,
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
  setAsLended,
  setAsReturned,
};