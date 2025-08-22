function createCourseRoutes(app) {
  // list all courses
  app.get("/course/purchase", function (req, res) {
    res.json({
      message: "list all courses endpoint",
    });
  });

  // lists all the course purchased by user
  app.get("course/preview", function (req, res) {
    res.json({
      message: "my courses endpoint",
    });
  });
}

module.exports = {
    createCourseRoutes: createCourseRoutes
}