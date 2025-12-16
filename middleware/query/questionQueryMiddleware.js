const asyncErrorWrapper = require("express-async-handler")
const { searchHelper, populateHelper } = require("./queryMiddlewareHelpers");
const questionQueryMiddleware = function (model, options) {
    return asyncErrorWrapper(async function (req, res, next) {
        let query = model.find();
        //search
        query = searchHelper("search", query, req);
        if (options && options.population) {
            query = populateHelper(options.population, query);
        }

    })
}
module.exports = {
    questionQueryMiddleware
}