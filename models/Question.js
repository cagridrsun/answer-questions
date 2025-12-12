const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"],
        minlength: [10, "Title must be at least 10 characters long"],
        unique: true
        //bu bir sorudur
    },
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [20, "Content must be at least 20 characters long"]
    },
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }
    ]

})
QuestionSchema.pre("save", function () {
    if (this.isModified("title")) {
        this.slug = this.makeSlug();
    }
})
QuestionSchema.methods.makeSlug = function () {
    return slugify(this.title, {
        lower: true,
        replacement: "-",
        remove: /[*+~.()'"!:@]/g

    }
    );
}
module.exports = mongoose.model("Question", QuestionSchema);
