const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Question = require("../models/Question");
const AnswerSchema = new Schema({
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [10, "Content must be at least 10 characters long"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide a user"]
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: [true, "Please provide a question"]
    }
})
AnswerSchema.pre("save", async function (next) {
    if (this.isModified("user")) {
        return next();
    }
    try {
        const question = await Question.findById(this.question);
        question.answers.push(this._id);
        question.answersCount = question.answers.length;
        await question.save();
        next();
    } catch (error) {
        next(error);
    }
})

module.exports = mongoose.model("Answer", AnswerSchema);