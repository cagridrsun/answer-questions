const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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

module.exports = mongoose.model("Answer", AnswerSchema);