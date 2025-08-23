const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");

function userMiddleware (req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET);

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
    adminMiddleware: adminMiddleware
}