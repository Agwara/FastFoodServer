const { clearHash } = require("../services/cache")

module.exports = async (request, response, next) => {
    await next()

    clearHash(JSON.stringify(request.customer._id))
}