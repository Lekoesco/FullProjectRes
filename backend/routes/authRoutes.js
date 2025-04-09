const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

console.log("AUTH CONTROLLER:", authController); // <-- πρόσθεσέ το αυτό

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

module.exports = router;
