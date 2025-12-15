const express = require("express");

const router = express.Router({ mergeParams: true });
const { getAccessToRoute } = require("../middleware/authorization/auth");
const { checkAnswerExist } = require("../middleware/database/databaseErrorHelpers");
const { addNewAnswerToQuestion, getAllAnswers, getSingleAnswer, editAnswer, deleteAnswer, likeAnswer, unlikeAnswer } = require("../controller/answer");
const { getAnswerOwnerAccess } = require("../middleware/authorization/auth");
router.post("/", getAccessToRoute, addNewAnswerToQuestion)
router.get("/", getAllAnswers)
router.get("/:answer_id", checkAnswerExist, getSingleAnswer)
router.put("/:answer_id/edit", [checkAnswerExist, getAccessToRoute, getAnswerOwnerAccess], editAnswer)
router.delete("/:answer_id/delete", [checkAnswerExist, getAccessToRoute, getAnswerOwnerAccess], deleteAnswer)
router.get("/:answer_id/like", [checkAnswerExist, getAccessToRoute], likeAnswer)
router.get("/:answer_id/unlike", [checkAnswerExist, getAccessToRoute], unlikeAnswer)
module.exports = router;