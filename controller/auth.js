const User = require("../models/user")
const CustomError = require("../middleware/errors/customError")
const asyncErrorWrapper = require("express-async-handler")
const { sendJwtToClient } = require("../helpers/authorizate/tokenHelpers")
const { validateUserInput, comparePassword } = require("../helpers/input/İnpuHelpers")
const user = require("../models/user")
const sendEmail = require("../helpers/libraries/sendEmail")
const register = asyncErrorWrapper(async (req, res, next) => {
    // post data

    // try catch

    // async await
    const { name, email, password, role } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role

    });
    sendJwtToClient(user, res);
});
const login = asyncErrorWrapper(async (req, res, next) => {

    const { email, password } = req.body;
    if (!validateUserInput(email, password)) {
        return next(new CustomError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");// .select("+password") şifreyi de almak için kullanılır.
    if (!comparePassword(password, user.password)) {
        return next(new CustomError("Please check your email and password", 400));
    }
    sendJwtToClient(user, res);

});
const logout = asyncErrorWrapper(async (req, res, next) => {

    const { NODE_ENV } = process.env;
    res.status(200).cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development" ? false : true,
    }).json({
        success: true,
        message: "Logout successful"
    })
})

const getuser = (req, res, next) => {
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    });
};

const imageUpload = asyncErrorWrapper(async (req, res, next) => {
    //Image Upload Success
    await User.findByIdAndUpdate(req.user.id, { "profile_image": req.savedProfileImage },
        {
            new: true,
            runValidators: true
        }); // Veritabanına profile_image kısmının dosya yolunu güncelledik ve yeni kullanıcı bilgilerini alıyoruz.
    res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        image: req.savedProfileImage,
        data: user
    })
})
// forget password
const forgotpassword = asyncErrorWrapper(async (req, res, next) => {
    const resetEmail = req.body.email;
    const user = await User.findOne({ email: resetEmail });
    if (!user) {
        return next(new CustomError("There is no user with that email", 400));
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser();
    await user.save();

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    const emailTemplate = `
    <h1>Reset Password</h1>
    <p> This <a href="${resetPasswordUrl}" target="_blank">link</a> will expire in 1 hour</p>
    `;
    try {
        await sendEmail(
            {
                from: process.env.SMTP_USER,
                to: user.email,
                subject: "Reset Password",
                html: emailTemplate
            }
        )
        return res.status(200).json({
            success: true,
            message: "token sent to your email",

        })
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(new CustomError("Email could not be sent", 500));
    }


})
const resetPassword = asyncErrorWrapper(async (req, res, next) => {
    const { resetPasswordToken } = req.query
    const { password } = req.body
    if (!resetPasswordToken) {
        return next(new CustomError("No token found", 400));
    }
    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() } // mongodb büyüktür deme ---> $gt
    })
    if (!user) {
        return next(new CustomError("No token found", 400));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();//şifreyi kaydedip hash ile kaydedilmesine yarar . 
    return res.json({
        success: true,
        message: "Password reset successfully"
    })

})
const editdetails = asyncErrorWrapper(async (req, res, next) => {
    const editInformation = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
        new: true,
        runValidators: true
    })
    return res.status(200).json({
        success: true,
        message: "Kullanıcı bilgileri güncellendi",
        data: user
    })
})

module.exports = {
    register,
    getuser,
    login,
    logout,
    imageUpload,
    editdetails,
    forgotpassword,
    resetPassword
}