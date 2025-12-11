const CustomError = require("./customError");

const customErrorHandler = (err, req, res, next) => {
    let customErr = err;

    if (err.name === "SyntaxError") {
        customErr = new CustomError("Unexpected Syntax", 400);
    }

    if (err.name === "ValidationError") {
        customErr = new CustomError(err.message, 400);
    }

    const statusCode = customErr.status || 500;
    const message = customErr.message || "Internal Server Error";

    console.log(message, statusCode);

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = customErrorHandler;