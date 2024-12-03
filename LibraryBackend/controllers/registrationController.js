const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { jwtKey } = require("../keys");
const bcrypt = require("bcrypt");
const cloudinary = require("../cloudinary/imageUpload");
const {
  generateOTP,
  verificationMail,
  mailTransport,
  generateEmailTemplate,
  passwordResetTemplate,
} = require("../utils/mail");
const { sendError, createRandomBytes } = require("../utils/helper");
const { isValidObjectId } = require("mongoose");
require("dotenv").config();

const User = mongoose.model("Registration");
const VerificationOTP = mongoose.model("VerificationOTP");
const ResetPasswordToken = mongoose.model("ResetPasswordToken");

global.io.on("connection", (socket) => {
  // console.log("socket connected in registration controllers!");

  socket.on("join room", (registration_id) => {
    socket.join(registration_id);
  });
});

// Registration or signup
const signup = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    gender,
    libraryName,
    libraryAddress,
  } = req.body;
  try {
    const isAlreadyHasEmail = await User.findOne({ email });
    if (!isAlreadyHasEmail || !isAlreadyHasEmail.email) {
    } else {
      return res.json({
        success: false,
        message: "This email is already in use! try again",
      });
    }

    if (password !== confirmPassword)
      return res.json({
        success: false,
        message: "password does not match, please try again",
      });

    // create user
    const user = new User({
      firstName,
      lastName,
      gender,
      libraryName,
      libraryAddress,
      email,
      password,
      confirmPassword,
    });
    // generate OTP
    const OTP = generateOTP();
    const verificationOTP = new VerificationOTP({
      owner: user._id,
      token: OTP,
    });

    const token = jwt.sign({ userId: user._id }, jwtKey, {
      expiresIn: "1d",
    });
    // save user & otp
    await verificationOTP.save();
    await user.save({ tokens: token });

    const userInfo = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      libraryName: user.libraryName,
      libraryAddress: user.libraryAddress,
      email: user.email,
      avatar: user.avatar ? user.avatar : null,
      otp: OTP,
    };
    // send email verification mail
    mailTransport().sendMail({
      from: process.env.adminMail,
      to: userInfo.email,
      subject: "Email verification",
      html: generateEmailTemplate(
        OTP,
        userInfo.firstName,
        "Please verify your email",
        "Verify your email to continue..",
        "Verification Code is."
      ),
    });
    // get token and user info
    res.json({
      success: true,
      token,
      user: userInfo,
      message:
        "You Registered Successfully, OTP sent to your email Please Verify your email!",
    });
  } catch (error) {
    console.log(error.message);
    return sendError(res, error.message, 500);
  }
};
// verify Email
const verifyEmail = async (req, res) => {
  try {
    const { userId, otpCode } = req.body;

    if (!userId || !otpCode.trim())
      return sendError(res, "Invalid request, missing parametes");

    if (!isValidObjectId(userId)) return sendError(res, "Invalid user id");

    const user = await User.findById(userId);
    if (!user) return sendError(res, "Sorry user not found");

    if (user.isVerified)
      return sendError(res, "This account is already verified");

    const otpToken = await VerificationOTP.findOne({ owner: user._id });
    if (!otpToken) return sendError(res, "Sorry, user not found!");

    const isMatch = await bcrypt.compare(otpCode, otpToken.token);
    if (!isMatch) return sendError(res, "Please provide valid OTP");

    user.isVerified = true;
    await VerificationOTP.findByIdAndDelete(otpToken._id);
    await user.save();

    res.json({
      success: true,
      message: "Email verified Successfully",
    });
  } catch (error) {
    sendError(res, error.message);
  }
};
// signin
const signIn = async (req, res) => {
  try {
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
    }
    if (!user.isVerified) {
      return res.json({
        success: false,
        message: "Email not verified, Please verify your email first!",
      });
    }
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
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      libraryName: user.libraryName,
      libraryAddress: user.libraryAddress,
      email: user.email,
      avatar: user.avatar ? user.avatar : null,
    };
    res.json({
      success: true,
      user: userInfo,
      token,
      message: "Logged in Successfully",
    });
  } catch (error) {
    let status_code = error.status.code != undefined ? error.status_code : 500;
    let type = error.type != undefined ? error.type : "Bad Request";
    console.log("type", error.type);
    return res.status(status_code).send({
      success: false,
      error: type,
      message: error.message,
    });
  }
};
// sign out
const signOut = async (req, res) => {
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
      const signedOutUser = await User.findByIdAndUpdate(req.user._id, {
        tokens: filteredToken,
      });

      const user = `${signedOutUser.firstName} ${signedOutUser.lastName}`;
      res.json({
        success: true,
        message: `${user} You signed out successfully!`,
      });
    }
  } catch (error) {
    console.log("signed out error", error.message);
  }
};
// forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, "Please provide a valid email");

  const user = await User.findOne({ email: email });
  if (!user) return sendError(res, "User not found, Invalid request");

  const token = await ResetPasswordToken.findOne({ owner: user._id });
  if (token)
    return sendError(
      res,
      "Only after one hour you can request for another token"
    );
  // generate token and save in database
  const randomBytes = await createRandomBytes();
  const createResetToken = new ResetPasswordToken({
    owner: user._id,
    token: randomBytes,
  });
  const isTokenSaved = await createResetToken.save();

  const link = `http://192.168.137.1:3000/resetPassword?token=${randomBytes}&id=${user._id}`;
  // link sent to provided email
  if (isTokenSaved) {
    mailTransport().sendMail({
      from: process.env.adminMail,
      to: email,
      subject: "Password Reset",
      html: passwordResetTemplate(
        link,
        user.firstName,
        "Password Reset",
        "To reset your password, click on the link given below, reset password screen will appear!"
      ),
    });
  } else {
    res.json({
      success: false,
      message: "OTP not sent to your email, please try again!",
    });
  }

  res.json({
    success: true,
    token: randomBytes,
    id: user._id,
    message:
      "Password reset OTP is sent to your email, which is valid for 0ne hour only. Please check your email inbox or spam section",
  });
};
// reset password
const resetPassword = async (req, res) => {
  const { password } = req.body;
  // req.user is coming from middleware isResetpasswordTokenValid (req.user._id)
  const user = await User.findById(req.user._id);
  if (!user) return sendError(res, "user not found");

  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) return sendError(res, "New password must be different");

  if (password.trim().length < 8 || password.trim().length > 20)
    return sendError(res, "New password must be 8 to 20 characters long");

  user.password = password.trim();
  await user.save();

  await ResetPasswordToken.findOneAndDelete({ owner: user._id });

  res.json({ success: true, message: "Password Reset Successfully" });
};

// upload profile image
const uploadProfileImage = async (req, res) => {
  const { user } = req;
  // console.log(req.file)
  // console.log(req.body)
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
    const response = await User.findByIdAndUpdate(
      user._id,
      {
        avatar: result.url,
      },
      { new: true }
    );
    // emit data through socket and received in customDrawerContent.js
    io.to(user._id).emit("send_profile", response);

    res.status(201).json({
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
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      gender: req.user.gender,
      libraryName: req.user.libraryName,
      libraryAddress: req.user.libraryAddress,
      email: req.user.email,
      avatar: req.user.avatar ? req.user.avatar : "",
    },
  });
};
// isUserVerified
const isUserVerified = async (req, res) => {
  try {
    const user = await User.find({ isVerified: false });
    // console.log(user);
    res.json({ success: true, user });
  } catch (error) {
    if (error?.response?.data) {
      const { data } = error.response;
      if (!data.success) return sendError(res, data.error);
      return console.log("error", error.response.data);
    }
  }
};

module.exports = {
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  signIn,
  signOut,
  uploadProfileImage,
  sendProfileToClient,
  isUserVerified,
};
