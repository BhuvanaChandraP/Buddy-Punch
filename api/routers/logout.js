const logoutRouter = require("express").Router();
const Student = require("../../database/models/student");
const Faculty = require("../../database/models/faculty");
logoutRouter.get("/", async (req, res) => {
  try {
    let id = req.jwt_payload._id;

    let student = await Student.findById(id);
    if (student) {
      localStorage.removeItem("Token");
      localStorage.removeItem("Faculty");
      return res.status(200).json({
        message: "Student Logged-out successfully",
        token,
      });
    }
    let faculty = await Faculty.findById(id)
    if (faculty) {
      localStorage.removeItem("Token");
      localStorage.removeItem("Faculty");
      return res.status(200).json({
        message: "Faculty Logged-out successfully",
        token,
      });
    }
    return res.status(400).json({
      message: "No student found",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server Error, Try again Later!",
    });
  }
});

module.exports = logoutRouter;
