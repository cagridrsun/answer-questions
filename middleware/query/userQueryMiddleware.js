const asyncErrorWrapper = require("express-async-handler")
const { searchHelper, pagginationHelper } = require("./queryMiddlewareHelpers");




const userQueryMiddleware = function (model, options) {
    return asyncErrorWrapper(async function (req, res, next) {
        let query = model.find();
        //search
        query = searchHelper("name", query, req);
        const paginationResult = await pagginationHelper(model, query, req);
        query = paginationResult.query;
        const pagination = paginationResult.pagination;
        const queryResults = await query;
        res.queryResults = {
            success: true,
            count: queryResults.length,
            pagination: pagination,
            data: queryResults
        };
        next();
    })
}



module.exports = {
    userQueryMiddleware
}