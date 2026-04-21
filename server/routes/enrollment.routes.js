const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const router = express.Router();

const {
  requestEnrollment,
  getMyEnrollments,
  getPendingRequests,
  approveOrReject,
} = require("../controllers/enrollment.controller");

//student request enrollment
router.post("/request", authMiddleware, requestEnrollment);

//get my enrollments
router.get("/", authMiddleware, getMyEnrollments);

//get pending enrollments
router.get("/pending", adminMiddleware, getPendingRequests);

//approve or reject enrollment
router.put("/approve-reject/:id", adminMiddleware, approveOrReject);

module.exports = router;
