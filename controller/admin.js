const User = require("../models/user")
const asyncErrorWrapper = require("express-async-handler")
const CustomError = require("../middleware/errors/customError")

const blockUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    user.blocked = !user.blocked;
    await user.save();
    return res.status(200).json({
        success: true,
        message: "Kullanıcı engelleme - kaldırma işlemi başarılı",
    })

})
const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    await user.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Kullanıcı silme işlemi başarılı",
    })
})

module.exports = {
    blockUser,
    deleteUser
}