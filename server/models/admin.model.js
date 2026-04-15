const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const adminSchema = new Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
    required: [true, "email is required!"],
    unique: [true, "admin already exist!"],
  },

  password: {
    type: String,
    required: [true, "password is required!"],
  },
});

adminSchema.pre("save", async function () {
  const user = this;

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    console.log(error);
  }
});

//generate token
adminSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign(
      {
        adminId: this._id.toString(),
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

adminSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const ADMIN = mongoose.model("admin", adminSchema);

module.exports = ADMIN;
