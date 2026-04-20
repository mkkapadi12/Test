const express = require("express");
const { createOrder } = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/create", authMiddleware, createOrder);

module.exports = router;
