const express = require("express");
const { getSingleUser, getAllUsers } = require("../controller/user.js");
const { checkUserExist } = require("../middleware/database/databaseErrorHelpers.js");
const User = require("../models/user.js");

const { userQueryMiddleware } = require("../middleware/query/userQueryMiddleware.js");
const router = express.Router();

router.get("/", userQueryMiddleware(User), getAllUsers);
router.get("/:id", checkUserExist, getSingleUser);






module.exports = router;
