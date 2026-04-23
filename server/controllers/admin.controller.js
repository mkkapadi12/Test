const USER = require("../models/user.model");
const ADMIN = require("../models/admin.model");

const register = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const existingAdmin = await ADMIN.findOne({ email });
    if (existingAdmin) {
      const error = new Error("Admin already exists");
      error.statusCode = 400;
      return next(error);
    }

    const newAdmin = await ADMIN.create({ name, email, password });

    return res.status(201).json({
      msg: "Registration successfully!",
      token: await newAdmin.generateToken(),
      userId: newAdmin._id.toString(),
    });
  } catch (error) {
    return next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await ADMIN.findOne({ email });

    if (!admin) {
      const error = new Error("admin not found");
      error.statusCode = 404;
      return next(error);
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    return res.status(200).json({
      msg: "Login successful!",
      token: await admin.generateToken(),
      adminId: admin._id.toString(),
    });
  } catch (error) {
    return next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    const admin = req.admin;
    return res.status(200).json({
      msg: "Profile retrieved successfully!",
      admin,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const students = await USER.find();
    return res.status(200).json({
      msg: "Students retrieved successfully!",
      students,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  login,
  register,
  profile,
  getAllStudents,
};
