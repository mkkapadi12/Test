const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
      unique: [true, "Product already exist"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: [true, "Admin Id is required"],
    },

    images: [],

    quantity: {
      type: Number,
      required: [true, "quantity is required"],
    },

    discount: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "product price is required"],
    },

    exp_date: {
      type: Date,
      required: [true, "exp_date is required"],
    },
  },
  {
    timestamps: true,
  },
);

const PRODUCT = mongoose.model("product", productSchema);

module.exports = PRODUCT;
