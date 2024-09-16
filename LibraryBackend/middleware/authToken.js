const mongoose = require("mongoose");
const User = mongoose.model("Registration");
const jwt = require("jsonwebtoken");
const { jwtKey } = require("../keys");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  // console.log(req.headers)
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    try {
      const verifyToken = jwt.verify(token, jwtKey);
      const user = await User.findById(verifyToken.userId);
      console.log(verifyToken)
      console.log(user.email)
      if (!user) {
        return res.json({ success: false, message: "unauthorized access!" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.log(error.name)
      if (error.name === "JsonWebTokenError") {
        return res.json({ success: false, message: "unauthorised access! JsonWebTokenError" });
      }
      if (error.name === "TokenExpiredError") {
        return res.json({
          success: false,
          message: "Session Expired, Try Sign in!",
        });
      }
      res.json({success: false, message: "Internal server error!"})
    }
  } else {
    res.json({ success: false, message: "unauthorized access!" });
  }
};