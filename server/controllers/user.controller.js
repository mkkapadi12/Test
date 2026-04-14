const USER = require("../models/user.model");

const register = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const user = await USER.find({ email: email });

    if (user) {
      return res.status(403).json({ msg: "User already exist !" });
    }

    const newUser = await USER.create({ name, email, password });

    return res.status(201).json({
      msg: "Registration successfully!",
      token: await newUser.generateToken(),
      userId: newUser._id.toString(),
    });
  } catch (error) {
    return next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await USER.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    return res.status(200).json({
      msg: "Login successful!",
      token: await user.generateToken(),
      userId: user._id.toString(),
    });
  } catch (error) {
    return next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json({
      msg: "Profile retrieved successfully!",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  login,
  register,
  profile,
};
