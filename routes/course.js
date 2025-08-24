const { Router } = require("express");
const { userMiddleware } = require("../middleware/auth");
const { userModel, courseModel } = require("../db");
const courseRouter = Router();
const { purchaseModel } = require("../db");

  // list all courses
  courseRouter.post("/purchase", userMiddleware, async function (req, res) {
    const userId = userId;
    const courseId = req.body.courseId;

    // should check if the user has already paid the price for the course
    await purchaseModel.create({
      userId,
      courseId
    })
    // you expect user to pay you money
    res.json({
      message: "You have successfully purchased the course"
    })
  })

  // lists all the course the user can see without logging in
  courseRouter.get("/preview", async function(req, res) {

    const courses = await courseModel.find({})
    res.json({
      courses
    })
  })

module.exports = {
    courseRouter: courseRouter
}