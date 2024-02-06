const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser')
const authToken = require('../middleware/authToken')

const registrationController = require("../controllers/registrationController");

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))
// routes
router.post('/signup', registrationController.signup);
router.post('/signin', authToken, registrationController.signin);

// router.get("/login", authToken, registrationController.login);


module.exports = router
