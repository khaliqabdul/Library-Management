const mongoose = require("mongoose");

// Defining Schema
const readerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  gender: { type: String, required: true },
  birthDate: { type: Date },
  phone: {
    type: Number,
    // required: true,
    min: 10,
  },
  CNIC_No: {
    type: String,
    // required: true,
    min: 15,
  },
  age: { type: Number, trim: true },
  address: { type: String, required: true },
  isBlackListed: { type: Boolean },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reader", readerSchema);
