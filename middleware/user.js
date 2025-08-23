const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = require("../config");

function userMiddleware (req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_USER_SECRET);

    if (decoded){
        req.userid = deocded.id;
        next();
    } else {
        res.status({
            message: "You are not signed in"
        })
    }
}

module.exports = {
    userMiddleware: userMiddleware
}