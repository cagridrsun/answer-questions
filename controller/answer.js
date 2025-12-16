const Question = require("../models/Question")
const Answer = require("../models/answer")
const CustomError = require("../middleware/errors/customError");
const asyncErrorWrapper = require("express-async-handler");

const addNewAnswerToQuestion = asyncErrorWrapper(async (req, res, next) => {

    const { question_id } = req.params
    const user_id = req.user.id
    const information = req.body; //content 
    const answer = await Answer.create({
        ...information,
        user: user_id,
        question: question_id
    })
    return res.status(200).json({
        success: true,
        data: answer
    })
})
const getAllAnswers = asyncErrorWrapper(async (req, res, next) => {
    const { question_id } = req.params
    const question = await Question.findById(question_id)

    const answers = await Answer.find({ question: question_id })

    return res.status(200).json({
        success: true,
        count: answers.length,
        data: answers
    })

})
const getSingleAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params
    const answer = await Answer
        .findById(answer_id)
        .populate("user")// user bilgislerini getirir 
        .populate({
            path: "question",
            select: "title"
        })// question bilgisini getirir

    return res.status(200).json({
        success: true,
        data: answer
    })
})
const editAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params
    const { content } = req.body
    let answer = await Answer.findById(answer_id)
    answer.content = content
    await answer.save()
    return res.status(200).json({
        success: true,
        data: answer
    })

})
const deleteAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params
    const { question_id } = req.params
    await Answer.findByIdAndDelete(answer_id)
    const question = await Question.findById(question_id)
    question.answers.splice(question.answers.indexOf(answer_id), 1)
    question.answersCount = question.answers.length

    await question.save()
    return res.status(200).json({
        success: true,
        data: {}
    })
})
const likeAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params
    const answer = await Answer.findById(answer_id)
    answer.likes.push(req.user.id)
    await answer.save()
    return res.status(200).json({
        success: true,
        data: answer
    })
})
const unlikeAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params
    const answer = await Answer.findById(answer_id)
    if (!answer.likes.includes(req.user.id)) {
        return next(new CustomError("You can not undo operation for this answer", 400))
    }
    const index = answer.likes.indexOf(req.user.id)
    answer.likes.splice(index, 1)
    await answer.save()
    return res.status(200).json({
        success: true,
        data: answer
    })
})
module.exports = {
    addNewAnswerToQuestion,
    getAllAnswers,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    unlikeAnswer
}
