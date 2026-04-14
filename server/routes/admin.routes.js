const express = require("express");
const adminController = require("../controllers/admin.controller");
const adminMiddleware = require("../middlewares/admin.middleware");
const router = express.Router();

router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.get("/profile", adminMiddleware, adminController.profile);

module.exports = router;
