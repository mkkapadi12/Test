const jwt = require("jsonwebtoken");
const ADMIN = require("../models/admin.model");

const adminMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    const error = new Error("Unauthorized HTTP, Token not provided !");
    error.statusCode = 401;
    return next(error);
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    const adminData = await ADMIN.findOne({ email: isVerified.email }).select({
      password: 0,
    });

    req.admin = adminData;
    req.token = token;
    req.adminId = adminData._id;
    next();
  } catch (error) {
    const errorObj = new Error("Unauthorized ! Invalid Token");
    errorObj.statusCode = 401;
    return next(errorObj);
  }
};

module.exports = adminMiddleware;
