// installed express, jsonwebtoken, dotenv, mongoose

const express = require("express");

const app = express();

// login, signup, purchase routes

app.post("/user/signup", function (req, res){
    res.json({
        message: "signup endpoint"
    })
});

app.post("/user/signin", function(req, res){
    res.json({
        message: "signin endpoint"
    })
});

// lets user purchase a course
app.post("/user/purchases", function(req, res){
    res.json({
        message: "purchase course endpoint"
    })
});

// list all courses
app.get("/course/purchase", function(req, res){
    res.json({
        message: "list all courses endpoint"
    })
});

// lists all the course purchased by user
app.get("courses", function(req, res){
    res.json({
        message: "my courses endpoint"
    })
});

app.listen(3000);