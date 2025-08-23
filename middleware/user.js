const jwt = require("jsonwebtoken");

function userMiddleware (req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, )
}

module.exports = {
    userMiddleware: userMiddleware
}