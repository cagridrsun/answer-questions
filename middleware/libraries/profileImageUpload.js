const multer = require("multer");
const path = require("path");
const customError = require("../errors/customErrorHandler");


// stroge , filefilter
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const rootDir = path.dirname(require.main.filename);
        cb(null, path.join(rootDir, "/public/uploads"))
    },
    filename: function (req, file, cb) {
        // file - mime type - image/png
        const extension = file.mimetype.split("/")[1];
        req.savedProfileImage = "image_" + req.user.id + "." + extension;
        cb(null, req.savedProfileImage);
    }
})
const fileFilter = function (req, file, cb) {
    let allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"]; //izin verdiğimiz dosya türleri
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new customError("Geçersiz dosya tipi", 400), false);
    }
    return cb(null, true);
}
const profileImageUpload = multer({
    storage, fileFilter
})
module.exports = profileImageUpload;