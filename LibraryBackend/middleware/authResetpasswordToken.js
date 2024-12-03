const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const bcrypt = require("bcrypt");
const { sendError } = require("../utils/helper");
const User = mongoose.model("Registration");
const ResetPasswordToken = mongoose.model("ResetPasswordToken");
const VerificationOTP = mongoose.model("VerificationOTP");

exports.isResetpasswordTokenValid = async (req, res, next) => {
  try {
    const { token, id } = req.query;
    // check for validation
    if (!token || !id) return sendError(res, "Invalid request");
    if (!isValidObjectId(id)) return sendError(res, "Invalid user...");
    // check for user
    const user = await User.findById(id);
    if (!user) return sendError(res, "user not found");
    // check for resetpasswordToken
    const resetToken = await ResetPasswordToken.findOne({ owner: user._id });
    if (!resetToken)
      return sendError(
        res,
        "Reset token not found. please go back and try again!"
      );
    // check token validity
    const isValidToken = await bcrypt.compare(token, resetToken.token);
    if (!isValidToken) return sendError(res, "Reset token is not valid");

    req.user = user;
    next();
  } catch (error) {
    sendError(res, error.message);
  }
};

exports.isEmailVerificationTokenValid = async (req, res, next) => {
  try {
    const { otp, userId } = req.query;
    // check for validation
    if (!otp || !userId) return sendError(res, "Invalid request");
    if (!isValidObjectId(userId)) return sendError(res, "Invalid user...");
    // check for user
    const user = await User.findById(userId);
    if (!user) return sendError(res, "user not found");
    // check for resetpasswordToken
    const resetToken = await VerificationOTP.findOne({ owner: user._id });
    if (!resetToken)
      return sendError(
        res,
        "Reset token not found. please go back and try again!"
      );
    // check token validity
    const isValidToken = await bcrypt.compare(otp, resetToken.token);
    if (!isValidToken) return sendError(res, "Invalid OTP token");

    req.user = user;
    next();
  } catch (error) {
    sendError(res, error.message);
  }
};
