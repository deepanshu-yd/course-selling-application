const { Router } = require("express");
const courseRouter = Router();

  // list all courses
  courseRouter.post("/purchase", function (req, res) {
    res.json({
      message: "list all courses endpoint",
    })
  })

  // lists all the course purchased by user
  courseRouter.get("/preview", function(req, res) {
    res.json({
      message: "my courses endpoint",
    })
  })

module.exports = {
    courseRouter: courseRouter
}