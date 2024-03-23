const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { jwtKey } = require("../keys");
const bcrypt = require("bcrypt");
const sharp = require("sharp");

const User = mongoose.model("Registration");

// Registration or signup
const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  // const isNewUser = await User.isThisEmailInUse(email);
  // if(!isNewUser) {
  //   return res.json({success: false, message: 'This email is already in use!'})
  // }
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    const token = jwt.sign({ userId: user._id }, jwtKey);
    await user.save();
    // get token
    // res.send({ token: token });
    res.json({success: true, token: token, user})
  } catch (error) {
    console.log(error.message);
    return res.status(422).send(error.message);
  }
};
// signin
const signin = async (req, res) => {
  // res.setHeader("Access-Control-Allow-Origin", "*")
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  // res.setHeader("Access-Control-Max-Age", "1800");
  // res.setHeader("Access-Control-Allow-Headers", "content-type");
  // res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" );
  try {
    console.log("login data", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "1Must provide email or password",
      });
      // res.status(422).send({error: '1 Must provide email or password'});
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Must provide email or password",
      });
      // res.status(422).send({error: 'Must provide email or password'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(422).send({ error: "Must provide email or password" });
    }
    //
    const token = jwt.sign({ userId: user._id }, jwtKey, {
      expiresIn: 60 * 60,
    });
    res.json({ success: true, user, token });
    // res.send({token, user})
  } catch (error) {
    console.log(error.message);
    return res.send(error.message);
  }
};
// upload profile image
const profileImage = async (req, res) => {
  const { user } = req;
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "unauthorize access!" });

    console.log("req.file", req.file)
  try {
    const profileBuffer = req.file.buffer;
    const imageInfo = await sharp(profileBuffer).metadata();
    const { width, height } = imageInfo;
    const finalProfileImage = await sharp(profileBuffer)
      .resize(Math.round(width * 0.5), Math.round(height * 0.5))
      .toBuffer();
    await User.findByIdAndUpdate(user._id, { avatar: finalProfileImage });
    res
      .status(201)
      .json({ success: true, message: "Your profile image has updated" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error, try after sometime!" });
    console.log("Error while uploading profile image", error.message);
  }
};

module.exports = {
  signup,
  signin,
  profileImage,
};
