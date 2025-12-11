const bcrypt = require("bcryptjs")
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Question = require("./Question");
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: [true, "Try differant email plesa"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid Email"
        ]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    password: {
        type: String,
        minlenght: 6,
        required: [true, "Please provide a password"],
        select: false

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String
    },
    about: {
        type: String
    },
    place: {
        type: String
    },
    website: {
        type: String
    },
    profile_image: {
        type: String,
        default: "default.jpeg"
    },
    blocked: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }


});
UserSchema.methods.getResetPasswordTokenFromUser = function () {
    const randomHexString = crypto.randomBytes(15).toString("hex");
    const { RESET_PASSWORD_EXPIRE } = process.env;
    console.log(randomHexString);
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(randomHexString)
        .digest("hex");//token oluşturma 
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;

}
UserSchema.pre("save", function (next) {
    // Skip hashing if password field was not touched.
    if (!this.isModified("password")) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);

            this.password = hash;
            next();
        });
    });
});
UserSchema.methods.generateJwtFromUser = function () {
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
    const payload = {
        id: this._id,
        name: this.name

    };
    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: "1h"
    })
    return token;
}

UserSchema.pre("remove", async function () {
    await Question.deleteMany({
        user: this._id
    });
})


module.exports = mongoose.model("User", UserSchema)
