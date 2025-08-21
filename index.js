// installed express, jsonwebtoken, dotenv, mongoose

const express = require("express");

const app = express();

// login, signup, purchase routes

app.post("/signup", function (req, res){

});

app.post("/signin", function(req, res){

});

app.post("/purchase-course", function(req, res){

});

app.get("/all-course", function(req, res){

});

app.get("purchased-courses", function(req, res){

});

app.listen(3000);