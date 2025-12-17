const express = require("express");
const question = require("../models/Question")
const { askNewQuestion, getAllQuestions, getSingleQuestion, editQuestion, deleteQuestion, likeQuestion, unlikeQuestion } = require(`../controller/question`);
const answer = require("./answer")
const { getAccessToRoute, getQuestionOwnerAccess, getQuestionDeleteAccess } = require(`../middleware/authorization/auth`);
const { checkQuestionExist } = require(`../middleware/database/databaseErrorHelpers`);
const { questionQueryMiddleware } = require(`../middleware/query/questionQueryMiddleware`);
const { answerQueryMiddleware } = require(`../middleware/query/answerQueryMiddleware`);
const router = express.Router();
router.get("/:id/like", [getAccessToRoute, checkQuestionExist], likeQuestion)
router.get("/:id/unlike", [getAccessToRoute, checkQuestionExist], unlikeQuestion)
router.post("/ask", getAccessToRoute, askNewQuestion);
router.get("/", questionQueryMiddleware(question, { population: { path: "user", select: "name profile_image" } }), getAllQuestions);
router.get("/:id", checkQuestionExist, answerQueryMiddleware(question, { population: [{ path: "user", select: "name profile_image" }, { path: "answer", select: "content" }] }), getSingleQuestion)
router.put("/:id/edit", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion)
router.delete("/:id/delete", [getAccessToRoute, checkQuestionExist, getQuestionDeleteAccess], deleteQuestion)
router.use("/:question_id/answers", checkQuestionExist, answer)
module.exports = router;