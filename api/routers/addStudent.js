const addStudentRouter = require("express").Router();
const Student = require("../../database/models/student");
const Course = require("../../database/models/course");
const Faculty = require("../../database/models/faculty");
const Monitor = require("../../database/models/monitor");
const StudentBehaviour = require("../../database/models/studentBehaviour");
addStudentRouter.post("/", async (req, res) => {
  try {
    let id = req.jwt_payload._id;
    let faculty = await Faculty.findById(id);
    if (!faculty) {
      return res.status(403).json({
        message: "Invalid token or token expired",
      });
    }
    const { courseId, studentId } = req.body;
    //console.log(courseId,studentId);
    if (!courseId || !studentId) {
      return res.status(400).json({
        message: "Fill all the fields!",
      });
    }
    let student = await Student.findById(studentId);
    let course = await Course.findById(courseId);
    if (!student) {
      return res.status(400).json({
        message: "No student found",
      });
    }
    if (!course) {
      return res.status(400).json({
        message: "No course found",
      });
    }
    if (!student.courses.includes(courseId)) {
      student.courses.push(courseId);
      await student.save();
      for (let i = 0; i < course.classes.length; i++) {
        let studentBehaviour = new StudentBehaviour();
        studentBehaviour.classes = course.classes[i];
        studentBehaviour.student = studentId;
        let monitor = await Monitor.findOne({ classes: course.classes[i] });
        console.log("monitor", monitor);
        monitor.studentsBehaviour.push(studentBehaviour.id);
        await studentBehaviour.save();
        await monitor.save();
      }
    }
    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      await course.save();
    }

    return res.status(200).json({
      message: "Student added to course",
      id: courseId,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server Error, Try again Later!",
    });
  }
});

module.exports = addStudentRouter;
