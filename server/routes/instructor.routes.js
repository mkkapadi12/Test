const express = require("express");
const {
  loginInstructor,
  registerInstructor,
  getInstructorProfile,
} = require("../controllers/instructor.controller");
const instructorMiddleware = require("../middlewares/instructor.middleware");
const router = express.Router();

router.post("/register", registerInstructor);
router.post("/login", loginInstructor);
router.get("/profile", instructorMiddleware, getInstructorProfile);

module.exports = router;
