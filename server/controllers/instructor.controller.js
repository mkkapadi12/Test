const INSTRUCTOR = require("../models/instructor.model");

const registerInstructor = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const existingInstructor = await INSTRUCTOR.findOne({ email });
    if (existingInstructor) {
      const error = new Error("Instructor already exists");
      error.statusCode = 400;
      return next(error);
    }

    const newInstructor = await INSTRUCTOR.create({
      name,
      email,
      password,
    });
    return res.status(201).json({
      msg: "Instructor registered successfully!",
      token: await newInstructor.generateToken(),
      instructorId: newInstructor._id.toString(),
    });
  } catch (error) {
    return next(error);
  }
};

const loginInstructor = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const instructor = await INSTRUCTOR.findOne({ email });

    if (!instructor) {
      const error = new Error("Instructor not found");
      error.statusCode = 404;
      return next(error);
    }

    const isMatch = await instructor.comparePassword(password);

    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    return res.status(200).json({
      msg: "Login successful!",
      token: await instructor.generateToken(),
      instructorId: instructor._id.toString(),
    });
  } catch (error) {
    return next(error);
  }
};

const getInstructorProfile = async (req, res, next) => {
  try {
    const instructor = req.instructor;
    return res.status(200).json({
      msg: "Profile retrieved successfully!",
      instructor,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  loginInstructor,
  registerInstructor,
  getInstructorProfile,
};
