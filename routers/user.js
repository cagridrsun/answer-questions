const express = require("express");
const { getSingleUser, getAllUsers } = require("../controller/user.js");
const { checkUserExist } = require("../middleware/database/databaseErrorHelpers.js");
const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", checkUserExist, getSingleUser);






module.exports = router;
