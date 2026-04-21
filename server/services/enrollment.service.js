const ENROLLMENT = require("../models/enrollment.model");

const requestEnrollment = async (studentId, courseId) => {
  const existing = await ENROLLMENT.findOne({
    student: studentId,
    course: courseId,
  });

  if (existing) {
    const error = new Error("Enrollment request already exists");
    error.statusCode = 409;
    throw error;
  }

  return await ENROLLMENT.create({
    student: studentId,
    course: courseId,
  });
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
  return await ENROLLMENT.find({ student: studentId })
    .populate("course", "title description instructor duration")
    .sort({ createdAt: -1 });
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
