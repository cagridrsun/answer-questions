const express = require("express");

const { getAccessToRoute, getAdminAccess } = require("../middleware/authorization/auth");
const { blockUser, deleteUser } = require("../controller/admin");
const { checkUserExist } = require("../middleware/database/databaseErrorHelpers");
const router = express.Router();
//Block user (kullanıcı blocklama)
//delete user (kullanıcı silme)
router.use([getAccessToRoute, getAdminAccess])

router.get("/block/:id", checkUserExist, blockUser)
router.delete("/user/:id", checkUserExist, deleteUser)


module.exports = router;