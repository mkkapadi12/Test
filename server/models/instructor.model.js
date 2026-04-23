const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const instructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    profilePicture: {
      type: String,
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true },
);

instructorSchema.pre("save", async function () {
  const instructor = this;

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(instructor.password, saltRound);
    instructor.password = hash_password;
  } catch (error) {
    console.log(error);
  }
});

//generate token
instructorSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign(
      {
        instructorId: this._id.toString(),
        email: this.email,
        name: this.name,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "24h",
      },
    );
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};

instructorSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const INSTRUCTOR = mongoose.model("Instructor", instructorSchema);
module.exports = INSTRUCTOR;
