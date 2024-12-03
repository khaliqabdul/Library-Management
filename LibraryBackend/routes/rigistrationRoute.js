const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const authToken = require("../middleware/authToken");
const multer = require("multer");
const path = require("path");

const registrationController = require("../controllers/registrationController");
const {
  isResetpasswordTokenValid,
  isEmailVerificationTokenValid,
} = require("../middleware/authResetpasswordToken");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   return cb(null, path.join(__dirname, '../images'));
  // },
  // filename: function (req, file, cb) {
  //   return cb(null, `${Date.now()}_${file.originalname}`);
  // },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("invalid image file", false);
  }
};

const uploads = multer({ storage, fileFilter });

// routes
router.post("/signup", registrationController.signup);
router.post(
  "/verifyEmail",
  isEmailVerificationTokenValid,
  registrationController.verifyEmail
);
router.post("/forgot-password", registrationController.forgotPassword);
router.post(
  "/reset-password",
  isResetpasswordTokenValid,
  registrationController.resetPassword
);
router.get("/verify-resetPassToken", isResetpasswordTokenValid, (req, res) => {
  res.json({ success: true, message: "token verified successfully" });
});
router.get("/verify-OTPToken", isEmailVerificationTokenValid, (req, res) => {
  res.json({ success: true, message: "OTP verified successfully" });
});
router.get("/isUserVerified", registrationController.isUserVerified);

router.post("/signin", registrationController.signIn);
router.post("/signout", authToken, registrationController.signOut);
router.post(
  "/upload-profile",
  authToken,
  uploads.single("profile"),
  registrationController.uploadProfileImage
);
router.get("/profile", authToken, registrationController.sendProfileToClient);

module.exports = router;
