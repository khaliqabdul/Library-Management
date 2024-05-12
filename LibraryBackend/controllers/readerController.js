const mongoose = require("mongoose");
const Member = require("../models/readerModel");
const User = mongoose.model("Registration");
var ObjectId = require('mongodb').ObjectId; 

global.io.on("connection", (socket) => {
  console.log("socket connected in reader controllers!");

  // listen from add member
  socket.on("add_member", async function (data) {
    var _id = new ObjectId(data.registration_id);
    const user = await User.findById({_id}).populate("reader_id")
    io.emit("send_member", user.reader_id);
  });
});

// create New Reader
const createNewReader = async (req, res) => {
  const { registration_id, name, age, gender, address, isBlackListed } =
    req.body;

  if (!registration_id)
    return res
      .status(401)
      .json({ success: false, message: "unauthorize access!" });

  try {
    const member = new Member({
      name,
      age,
      gender,
      address,
      isBlackListed,
    });
    const memberData = await member.save();

    await User.findByIdAndUpdate(
      { _id: registration_id },
      {
        $push: {
          reader_id: memberData._id,
        },
      }
    );

    res.send({ success: true, message: "member added successfully!" });
  } catch (error) {
    console.log(error.message);
    return res.status(422).send({ success: false, message: error.message });
  }
};
// get all members
const getAllReaders = async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res
      .status(401)
      .json({ success: false, message: "unauthorize access!" });
  try {
    const librarianData = await User.findById({ _id: id }).populate(
      "reader_id"
    );
    const memberData = librarianData.reader_id;
    res.send({
      success: true,
      message: "Populated the members successfully!",
      memberData,
    });

  } catch (error) {
    return res.status(422).send({ success: false, message: error.message });
  }
};

module.exports = {
  createNewReader,
  getAllReaders,
};
