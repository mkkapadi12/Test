const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middlewares/admin.middleware");

const {
  createCourse,
  getAllCourses,
  deleteCourse,
} = require("../controllers/course.controller");

//admin create course

router.post("/create", adminMiddleware, createCourse);

//get all courses

router.get("/", getAllCourses);

//delete course

router.delete("/:id", adminMiddleware, deleteCourse);

module.exports = router;
