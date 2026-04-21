const enrollmentService = require("../services/enrollment.service");
const { getIO } = require("../socket/socket");
const asyncHandler = require("../utils/asyncHandler");

const requestEnrollment = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const enrollment = await enrollmentService.requestEnrollment(
    req.user._id,
    courseId,
  );

  // Notify ALL admins in real-time
  getIO()
    .to("adminRoom")
    .emit("newEnrollmentRequest", {
      enrollment,
      studentName: req.user.name,
      message: `${req.user.name} requested to enroll in ${enrollment.course.title}`,
    });

  return res.status(201).json({ msg: "Enrollment request sent!", enrollment });
});

const approveOrReject = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;
  const enrollment = await enrollmentService.updateEnrollmentStatus(
    req.params.id,
    status,
    rejectionReason,
  );

  // Notify the specific student in real-time
  getIO().to(enrollment.student.toString()).emit("enrollmentUpdated", {
    courseId: enrollment.course,
    status,
    rejectionReason,
  });

  return res.status(200).json({ msg: `Enrollment ${status}`, enrollment });
});

const getAllEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.getAllEnrollments();
  return res.status(200).json({ enrollments });
});

const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.getEnrollmentsByStudent(
    req.user._id,
  );
  return res.status(200).json({ enrollments });
});

const getPendingRequests = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.getPendingEnrollments();
  return res.status(200).json({ enrollments });
});

module.exports = {
  requestEnrollment,
  getAllEnrollments,
  approveOrReject,
  getMyEnrollments,
  getPendingRequests,
};
