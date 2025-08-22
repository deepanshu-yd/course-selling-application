const Router = require("express");

const useRouter = Router();

useRouter.post("/signup", function(req, res){
    res.json({
        message: "signup endpoint"
    })
});

useRouter.post("/signin", function(req, res){
    res.json({
        message: "signin endpoint"
    })
});

// lets user purchase a course
useRouter.post("/purchases", function(req, res){
    res.json({
        message: "purchase course endpoint"
    })
});

module.exports = {
    useRouter: useRouter
}