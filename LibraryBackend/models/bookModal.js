const mongoose = require("mongoose");
// defining schema
const bookSchema = new mongoose.Schema({
  bookTitle: { type: String },
  author: {type: String},
  genre: { type: String },
  price: {type: Number},
  bookIntro: {type: String},
  image: { type: String },
  addedOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  lendingHistory: [
    {
      lendedOn: Date,
      lendedById: mongoose.Schema.Types.ObjectId,
      lendedByName: String,
      returnedOn: Date,
    },
  ],
});
module.exports = mongoose.model("Book", bookSchema)