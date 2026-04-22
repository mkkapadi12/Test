const mongoose = require("mongoose");
const ENROLLMENT = require("../models/enrollment.model");

const requestEnrollment = async (studentId, courseId) => {
  const existing = await ENROLLMENT.findOne({
    student: studentId,
    course: courseId,
  });

  if (existing) {
    if (existing.status === "approved") {
      const error = new Error("You are already enrolled in this course");
      error.statusCode = 409;
      throw error;
    }
    if (existing.status === "pending") {
      const error = new Error("Enrollment request already exists");
      error.statusCode = 409;
      throw error;
    }
    if (existing.status === "rejected") {
      const error = new Error("Enrollment request already rejected");
      error.statusCode = 409;
      throw error;
    }
  }

  const enrollment = await ENROLLMENT.create({
    student: studentId,
    course: courseId,
  });

  return await enrollment.populate("course", "title");
};

const updateEnrollmentStatus = async (
  enrollmentId,
  status,
  rejectionReason = null,
) => {
  const enrollment = await ENROLLMENT.findById(enrollmentId);

  if (!enrollment) {
    const error = new Error("Enrollment not found");
    error.statusCode = 404;
    throw error;
  }

  enrollment.status = status;
  enrollment.rejectionReason = rejectionReason;
  if (status === "approved") enrollment.approvedAt = new Date();

  return await enrollment.save();
};

const getAllEnrollments = async () => {
  return await ENROLLMENT.find()
    .populate("student", "name email")
    .populate("course", "title")
    .sort({ createdAt: -1 });
};

const getEnrollmentsByStudent = async (studentId) => {
  return await ENROLLMENT.aggregate([
    {
      $match: { student: new mongoose.Types.ObjectId(studentId) },
    },
    {
      $lookup: {
        from: "courses", // MongoDB collection name (lowercase + plural)
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course", // flatten the course array
    },
    {
      $match: { "course.isActive": true }, // now filter on course field
    },
    {
      $project: {
        status: 1,
        enrolledAt: 1,
        approvedAt: 1,
        rejectionReason: 1,
        createdAt: 1,
        "course.title": 1,
        "course.description": 1,
        "course.instructor": 1,
        "course.duration": 1,
        "course._id":1
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
};

const getPendingEnrollments = async () => {
  return await ENROLLMENT.find({ status: "pending" })
    .populate("student", "name email")
    .populate("course", "title")
    .sort({ createdAt: 1 });
};

module.exports = {
  requestEnrollment,
  getAllEnrollments,
  updateEnrollmentStatus,
  getEnrollmentsByStudent,
  getPendingEnrollments,
};
