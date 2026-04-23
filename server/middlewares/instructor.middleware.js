const jwt = require("jsonwebtoken");
const INSTRUCTOR = require("../models/instructor.model");

const instructorMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    const error = new Error("Unauthorized HTTP, Token not provided !");
    error.statusCode = 401;
    return next(error);
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    const instructorData = await INSTRUCTOR.findOne({
      email: isVerified.email,
    }).select({
      password: 0,
    });

    req.instructor = instructorData;
    req.token = token;
    req.instructorId = instructorData._id;
    next();
  } catch (error) {
    const errorObj = new Error("Unauthorized ! Invalid Token");
    errorObj.statusCode = 401;
    return next(errorObj);
  }
};

module.exports = instructorMiddleware;
