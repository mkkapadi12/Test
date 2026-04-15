const mongoose = require("mongoose");

const { Schema } = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User Id is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: [true, "Product Id is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total Amount is required"],
    },

    discount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const ORDER = mongoose.model("order", orderSchema);

module.exports = ORDER;
