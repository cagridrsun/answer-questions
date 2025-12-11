const express = require("express");
const { askNewQuestion, getAllQuestions, getSingleQuestion, editQuestion, deleteQuestion } = require(`../controller/question`);

const { getAccessToRoute, getQuestionOwnerAccess, getQuestionDeleteAccess } = require(`../middleware/authorization/auth`);
const { checkQuestionExist } = require(`../middleware/database/databaseErrorHelpers`);
const router = express.Router();
router.post("/ask", getAccessToRoute, askNewQuestion);
router.get("/", getAllQuestions);
router.get("/:id", checkQuestionExist, getSingleQuestion)
router.put("/:id/edit", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion)
router.delete("/:id/delete", [getAccessToRoute, checkQuestionExist, getQuestionDeleteAccess], deleteQuestion)
module.exports = router; 