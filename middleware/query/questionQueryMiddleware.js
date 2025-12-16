const asyncErrorWrapper = require("express-async-handler")
const { searchHelper, populateHelper, questionSortHelper, pagginationHelper } = require("./queryMiddlewareHelpers");
const questionQueryMiddleware = function (model, options) {
    return asyncErrorWrapper(async function (req, res, next) {
        let query = model.find();
        //search
        query = searchHelper("title", query, req);
        if (options && options.population) {
            query = populateHelper(options.population, query);
        }
        query = questionSortHelper(query, req);
        const total = await model.countDocuments();
        const paginationResult = await pagginationHelper(total, query, req);
        query = paginationResult.query;
        const pagination = paginationResult.pagination;
        const queryResults = await query;
        res
            .queryResults = {
            success: true,
            count: queryResults.length,
            pagination: pagination,
            data: queryResults
        };
        next();

    })
}
module.exports = {
    questionQueryMiddleware
}