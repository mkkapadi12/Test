const asyncHandler = require("../utils/asyncHandler");
const COURSE = require("../models/course.model");
const { getIO } = require("../socket/socket");

//create course
const createCourse = asyncHandler(async (req, res, next) => {
  console.log("controller:", req.body);
  const { title, description, instructor, duration } = req.body;
  if (!title || !description || !instructor || !duration) {
    const error = new Error("All fields are required");
    return next(error);
  }

  const existingCourse = await COURSE.findOne({ title });
  if (existingCourse) {
    const error = new Error("Course already exists");
    return next(error);
  }

  const course = await COURSE.create({
    title,
    description,
    instructor,
    duration,
    createdBy: req.admin.id,
  });

  // Notify ALL connected students in real-time
  getIO()
    .to("studentRoom")
    .emit("newCourseAvailable", {
      course,
      message: `New course available: ${title}`,
    });

  return res.status(201).json({ msg: "Course created successfully", course });
});

//get all course for student side
const getAllCourses = asyncHandler(async (req, res, next) => {
  const courses = await COURSE.find({ isActive: true });
  return res.status(200).json({ courses });
});

//get all course for admin side
const getAdminAllCourses = asyncHandler(async (req, res, next) => {
  const courses = await COURSE.find();
  return res.status(200).json({ courses });
});

//update course
const updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await COURSE.findByIdAndUpdate(id, req.body);
  return res.status(200).json({ course });
});

//update course status
const updateCourseStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await COURSE.findByIdAndUpdate(id, {
    isActive: req.body.isActive,
  });

  // Notify ALL connected students in real-time
  getIO()
    .to("studentRoom")
    .emit("courseUpdate", {
      course,
      message: `${course.title} has been ${req.body.isActive ? "activated" : "deactivated"} by admin`,
    });

  return res.status(200).json({ course });
});

//delete course
const deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await COURSE.findByIdAndDelete(id);
  return res.status(200).json({ course });
});

module.exports = {
  createCourse,
  getAllCourses,
  deleteCourse,
  getAdminAllCourses,
  updateCourse,
  updateCourseStatus,
};
