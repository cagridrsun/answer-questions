const express = require("express");
const { register, login, getuser, logout, imageUpload, forgotpassword, resetPassword, editdetails } = require("../controller/auth");
const { getAccessToRoute } = require("../middleware/authorization/auth")
const profileImageUpload = require("../middleware/libraries/profileImageUpload");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", getAccessToRoute, getuser);
router.get("/logout", getAccessToRoute, logout);
router.post("/forgotpassword", forgotpassword);
router.put("/resetpassword", resetPassword);
router.post("/upload", [getAccessToRoute, profileImageUpload.single("profile_image")], imageUpload)
router.put("/edit", getAccessToRoute, editdetails)

module.exports = router; 