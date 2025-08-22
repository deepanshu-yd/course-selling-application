const { Router } = require("express");

const userRouter = Router();

userRouter.post("/signup", function(req, res){
    res.json({
        message: "signup endpoint"
    })
});

userRouter.post("/signin", function(req, res){
    res.json({
        message: "signin endpoint"
    })
});

// lets user purchase a course
userRouter.get("/purchases", function(req, res){
    res.json({
        message: "purchase course endpoint"
    })
});

module.exports = {
    userRouter: userRouter
}