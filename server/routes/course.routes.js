const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middlewares/admin.middleware");

const {
  createCourse,
  getAllCourses,
  getAdminAllCourses,
  deleteCourse,
  updateCourse,
  updateCourseStatus,
} = require("../controllers/course.controller");

//admin create course

router.post("/create", adminMiddleware, createCourse);

//get all courses (all student)

router.get("/", getAllCourses);

//get all courses for admin

router.get("/admin", adminMiddleware, getAdminAllCourses);

//update course

router.put("/:id", adminMiddleware, updateCourse);

//update course status

router.patch("/status/:id", adminMiddleware, updateCourseStatus);

//delete course

router.delete("/:id", adminMiddleware, deleteCourse);

module.exports = router;
