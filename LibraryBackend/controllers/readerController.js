const mongoose = require("mongoose");
const Member = require("../models/readerModel");
const User = mongoose.model("Registration");
var ObjectId = require("mongodb").ObjectId;

global.io.on("connection", (socket) => {
  console.log("socket connected in reader controllers!");

  // listen from addMembers.js
  socket.on("add_member", async function (data) {
    var _id = new ObjectId(data.registration_id);
    const user = await User.findById({ _id }).populate("reader_id");
    // lesten in MembersList
    io.emit("send_member", user.reader_id);
  });
});

// create New Reader
const createNewReader = async (req, res) => {
  const {
    registration_id,
    name,
    age,
    gender,
    birthDate,
    mobileNumber,
    cnicNumber,
    address,
    isBlackListed,
  } = req.body;

  if (!registration_id)
    return res
      .status(401)
      .json({ success: false, message: "unauthorize access!" });

  try {
    const member = new Member({
      name,
      age,
      gender,
      birthDate,
      phone: mobileNumber,
      CNIC_No: cnicNumber,
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
// get all readers
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
// delete reader
const deleteReader = async (req, res) => {
  try {
    const data = req.body;
    const { id } = data.memberId;
    const registration_id = data.registration_id;

    const memberDeleted = await Member.findByIdAndDelete(
      { _id: id },
      { new: true }
    );
    // remove related reader_id from User
    await User.updateOne(
      { _id: registration_id },
      { $pull: { reader_id: id } }
    );

    if (memberDeleted) {
      const librarianData = await User.findById({
        _id: registration_id,
      }).populate("reader_id");
      const memberData = librarianData.reader_id;

      // listen in MembersList
      io.emit("delete_member", memberData);

      res.send({
        success: true,
        message: `Member "${memberDeleted.name}" deleted successfully!`,
      });
    }
  } catch (error) {
    return res.status(422).send({ success: false, message: error.message });
  }
};

module.exports = {
  createNewReader,
  getAllReaders,
  deleteReader,
};
