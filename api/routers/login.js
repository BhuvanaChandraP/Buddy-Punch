const loginRouter = require("express").Router();
const fs = require("fs");
const Student = require("../../database/models/student");
const Faculty = require("../../database/models/faculty");
const cloudinaryUpload = require("../../helpers/cloudinary");
const IdentifyFace = require("../../helpers/faceIdentification");
const jwt = require("jsonwebtoken");

loginRouter.post("/", async (req, res) => {
  try {
    const data = JSON.parse(req.body.image);
    var base64Data = data.replace(/^data:image\/jpeg;base64,/, "");
    // fs.writeFile(
    //   "./public/uploads/output.png",
    //   base64Data,
    //   "base64",
    //   function (err) {
    //     if (err) console.log(err);
    //   }
    // );

    const writeFile = async () => {
      return await new Promise((resolve) => {
        fs.writeFile(
          "./public/uploads/output.png",
          base64Data,
          "base64",
          function (err) {
              if (err) console.log(err);
            }
        );
        resolve("true");
      });
    };
    await writeFile();
    console.log("fini");
    let result = await cloudinaryUpload("./public/uploads/output.png");

    let personFound = await IdentifyFace(result.url);
    console.log("person found",personFound);
    if (personFound) {
      let student = await Student.findById(personFound.name);
      let faculty = await Faculty.findById(personFound.name);
      personFound = undefined;
      if (student) {
        const token = jwt.sign(
          {
            _id: student._id,
            rollNo: student.rollNo,
          },
          process.env.TOKEN_SECRET,
          { expiresIn: "168h" } // 7d
        );
        console.log("token", token);
        return res.status(200).json({
          message: "Student Loggedin successfully",
          token,
          isFaculty: false,
        });
      } else if (faculty) {
        const token = jwt.sign(
          {
            _id: faculty._id,
            idNo: faculty.idNo,
          },
          process.env.TOKEN_SECRET,
          { expiresIn: "168h" } // 7d
        );
        console.log("token", token);
        return res.status(200).json({
          message: "faculty Loggedin successfully",
          token,
          isFaculty: true,
        });
      }
    }

    return res.status(404).json({
      message: "No student or faculty found",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server Error, Try again Later!",
    });
  }
});

module.exports = loginRouter;
