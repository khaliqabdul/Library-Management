const mongoose = require("mongoose")
const Member = require("../models/readerModel")

// create New Reader
const createNewReader = async (req, res) => {
    const { name, age, gender, address, isBlackListed  } = req.body
    try {
        const member = new Member({
            name,
            age,
            gender,
            address,
            isBlackListed,
          });
          await member.save();
         
        res.send({success: true, message: "member added successfully!"})
    } catch (error) {
        console.log(error.message)
        return res.status(422).send({success: false, message: error.message})
    }
};
module.exports = {
    createNewReader,
}