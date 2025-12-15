const User = require("../../models/user")
const CustomError = require("../errors/customError")
const asyncErrorWrapper = require("express-async-handler")
const Question = require("../../models/Question")
const Answer = require("../../models/answer")
const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return next(new CustomError("User not found", 404));
    }
    next();
})
const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
    const question_id = req.params.id || req.params.question_id;
    const question = await Question.findById(question_id);
    if (!question) {
        return next(new CustomError("Question not found", 404));
    }
    next();
})
const checkAnswerExist = asyncErrorWrapper(async (req, res, next) => {
    const answer_id = req.params.id || req.params.answer_id;
    const question_id = req.params.question_id;
    const answer = await Answer.findOne({ _id: answer_id, question: question_id });
    if (!answer) {
        return next(new CustomError("Answer not found", 404));
    }
    next();
})
module.exports = {
    checkUserExist,
    checkQuestionExist,
    checkAnswerExist
}
