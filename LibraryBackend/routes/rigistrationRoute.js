const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const authToken = require("../middleware/authToken");
const multer = require("multer");

const registrationController = require("../controllers/registrationController");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({})

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
router.post("/signin", registrationController.signin);
router.post("/upload-profile",authToken,uploads.single("profile"),
  registrationController.profileImage
);

module.exports = router;
