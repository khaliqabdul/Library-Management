const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { jwtKey } = require("../keys");
const bcrypt = require("bcrypt");
const cloudinary = require("../cloudinary/imageUpload");

const User = mongoose.model("Registration");

// Registration or signup
const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  const isAlreadyHasEmail = await User.findOne({ email });
  if (!isAlreadyHasEmail || !isAlreadyHasEmail.email) {
  } else {
    return res.json({
      success: false,
      message: "This email is already in use! try again",
    });
  }
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    const token = jwt.sign({ userId: user._id }, jwtKey, {
      expiresIn: "1d",
    });
    await user.save({ tokens: token });
    // await User.findByIdAndUpdate(user._id, token);
    const userInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar ? user.avatar : "",
    };
    // get token and user info
    res.json({
      success: true,
      token,
      user: userInfo,
      message: "User Registered Successfully!",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(422).send(error.message);
  }
};
// signin
const signIn = async (req, res) => {
  try {
    // console.log("login data", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Must provide email or password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or password! Please try again",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password! Please try again",
      });
      // return res.status(422).send({ error: "Must provide email or password" });
    }
    //
    const token = jwt.sign({ userId: user._id }, jwtKey, {
      expiresIn: "1d",
    });

    let oldTokens = user.tokens || [];
    if (oldTokens.length) {
      oldTokens = oldTokens.filter((t) => {
        const timeDiffInSeconds = (Date.now() - parseInt(t.signedAt)) / 1000;
        if (timeDiffInSeconds < 86400) {
          return t;
        }
      });
    }

    await User.findByIdAndUpdate(user._id, {
      tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
    });

    const userInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar ? user.avatar : "",
    };

    res.json({ success: true, user: userInfo, token });
  } catch (error) {
    console.log(error.message);
    return res.send(error.message);
  }
};
// sign out
const signOut = async (req, res) => {
  // console.log("signout",req.headers)
  try {
    if (req.headers && req.headers.authorization) {
      const clientToken = req.headers.authorization.split(" ")[0];

      if (!clientToken) {
        return res
          .status(401)
          .json({ success: false, message: "Authorization Failed!" });
      }
      const databaseTokens = req.user.tokens;

      const filteredToken = databaseTokens.filter(
        (t) => t.token !== clientToken
      );
      await User.findByIdAndUpdate(req.user._id, { tokens: filteredToken });
      // console.log(req.user.tokens);
      res.json({ success: true, message: "Signed Out Successfully!" });
    }
  } catch (error) {
    console.log("signed out error", error.message);
  }
};

// upload profile image
const uploadProfileImage = async (req, res) => {
  const { user } = req;
  console.log(req.file)
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "unauthorize access!" });
  try {
    
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${user._id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });
    const response = await User.findByIdAndUpdate(user._id, {
      avatar: result.url,
    });
    // console.log(response.avatar)
    res
      .status(201)
      .json({
        success: true,
        message: "Your profile image has updated",
        user: response,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error, try after sometime!" });
    console.log("Error while uploading profile image", error.message);
  }
};
// send profile to client
const sendProfileToClient = (req, res) => {
  // req.user is coming from authToken method
  if (!req.user) {
    return res.json({ success: false, message: "unathorided access!" });
  }
  res.json({
    success: true,
    profile: {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      avatar: req.user.avatar ? req.user.avatar : "",
    },
  });
};

module.exports = {
  signup,
  signIn,
  signOut,
  uploadProfileImage,
  sendProfileToClient,
};
