const mongoose = require("mongoose");

const readerModel = require('../models/readerModel')

// create New Reader
const createNewReader = async (req, res) => {
    try {
        console.log("body", req.body.reader.name)
        res.send({success: true, message: "welcome to backend zone!"})
    } catch (error) {
        console.log(error.message)
        return res.status(422).send(error.message)
    }
};
module.exports = {
    createNewReader,
}