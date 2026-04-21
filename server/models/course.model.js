const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    duration: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const COURSE = mongoose.model("Course", courseSchema);
module.exports = COURSE;
