const User = require("../../models/user")
const CustomError = require("../errors/customError")
const asyncErrorWrapper = require("express-async-handler")
const Question = require("../../models/Question")

const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return next(new CustomError("User not found", 404));
    }
    next();
})
const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
        return next(new CustomError("Question not found", 404));
    }
    next();
})

module.exports = {
    checkUserExist,
    checkQuestionExist
}
