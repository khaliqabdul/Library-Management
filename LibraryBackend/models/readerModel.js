const mongoose = require('mongoose');

// Defining Schema
const readerSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    gender: {type: String, required: true},
    age: {type: Number, trim: true},
    address: {type:String, required: true},
    isBlackListed: {type: Boolean}
});

module.exports = mongoose.model("Reader", readerSchema)
