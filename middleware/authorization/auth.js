const customError = require("../errors/customError");
const asyncErrorWrapper = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.js");
const Question = require("../../models/Question.js");
const { isTokenIncluded, getAccessTokenFromHeader } = require("../../helpers/authorizate/tokenHelpers");
const Answer = require("../../models/answer.js");

const getAccessToRoute = (req, res, next) => {
    // Environment variable'ı al
    const { JWT_SECRET_KEY } = process.env;

    // 1. Token var mı kontrolü
    if (!isTokenIncluded(req)) {
        // HATA BURADAYDI: 401 parametresi eklendi.
        return next(new customError("You are not authorized to access this route", 401));
    }

    // 2. Token'ı al
    const accessToken = getAccessTokenFromHeader(req);

    // 3. Token'ı doğrula
    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new customError("You are not authorized to access this route", 401));
        }

        // ÖNEMLİ EKLEME: 
        // Token çözüldü ama bilgiyi req.user'a atamazsak sonraki route'larda kullanamayız.
        // decoded objesinin içinde user id'si vardır (id, name vs. token oluştururken ne koyduysanız).
        req.user = {
            id: decoded.id,
            name: decoded.name
        };
        req.user = {
            id: decoded.id,
            name: decoded.name
        }
        // Konsola yazdırıp kontrol edebilirsiniz
        console.log("Decoded Token:", decoded);

        next();
    });
};
const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);
    if (user.role !== "admin") {
        return next(new customError("Yetkiniz bulunmamaktadır , Admin yetkisine sahip olmalısınız", 403));
    }
    next();
})
//sorunun sahibi soruyu editliyebilir !!!
const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id;
    const questionId = req.params.id;
    const question = await Question.findById(questionId);
    if (question.user.toString() !== userId.toString()) //toString() ile id'ler string'e çevrildi.
    {
        return next(new customError("Sadece sorunun sahibi soruyu editliyebilir", 403));
    }
    next()

})
const getQuestionDeleteAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id;
    const questionId = req.params.id;
    const question = await Question.findById(questionId);
    if (question.user.toString() !== userId.toString()) //toString() ile id'ler string'e çevrildi.
    {
        return next(new customError("Sadece sorunun sahibi soruyu silme yetkiniz vardır", 403));
    }
    next()
})
const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id;
    const answerId = req.params.answer_id;
    const answer = await Answer.findById(answerId);

    if (!answer) {
        return next(new customError("Cevap bulunamadı", 404));
    }

    if (answer.user.toString() !== userId.toString()) //toString() ile id'ler string'e çevrildi.
    {
        return next(new customError("Sadece cevabın sahibi cevabı düzenleyebilir", 403));
    }
    next()

})
module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getQuestionDeleteAccess,
    getAnswerOwnerAccess
};