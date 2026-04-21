const asyncHandler = require("../utils/asyncHandler");
const COURSE = require("../models/course.model");

const createCourse = asyncHandler(async (req, res, next) => {
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
  return res.status(201).json({ course });
});

const getAllCourses = asyncHandler(async (req, res, next) => {
  const courses = await COURSE.find();
  return res.status(200).json({ courses });
});

const deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await COURSE.findByIdAndDelete(id);
  return res.status(200).json({ course });
});


module.exports = { createCourse, getAllCourses, deleteCourse };
