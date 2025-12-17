const Question = require("../models/Question");
const CustomError = require("../middleware/errors/customError");
const asyncErrorWrapper = require("express-async-handler");

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {
    return res.status(200).json(res.queryResults)
})
const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: res.queryResult
    })
})
const editQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { title, content } = req.body;
    let question = await Question.findById(id);
    question.title = title;
    question.content = content;
    question = await question.save();
    return res.status(200).json({
        success: true,
        data: question
    })
})
const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
    const information = req.body;

    const question = await Question.create({
        ...information,
        user: req.user.id

    });
    res.status(200).json({
        success: true,
        data: question
    })

})
const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        data: question
    })
})
const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    let question = await Question.findById(id);
    //eğer like edilmişse hata fırlatıyoruz
    if (question.likes.includes(req.user.id)) {
        return next(new CustomError("You already liked this question", 400));
    }
    question.likes.push(req.user.id);
    question.likesCount = question.likes.length;
    question = await question.save();
    res.status(200).json({
        success: true,
        data: question
    })
})
const unlikeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    let question = await Question.findById(id);
    //eğer like edilmemişse hata fırlatıyoruz
    if (!question.likes.includes(req.user.id)) {
        return next(new CustomError("You can not undo operation for this question", 400));
    }
    const index = question.likes.indexOf(req.user.id);
    question.likes.splice(index, 1);
    question.likesCount = question.likes.length;
    question = await question.save();
    res.status(200).json({
        success: true,
        data: question
    })
})
module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    unlikeQuestion
}