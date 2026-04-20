const ORDER = require("../models/order.model");
const PRODUCT = require("../models/product.model");

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await PRODUCT.findById(item.product);

      if (!product) {
        const error = new Error(`Product ${item.product} not found`);
        error.statusCode = 404;
        return next(error);
      }

      if (product.stock < item.quantity) {
        const error = new Error(`Insufficient stock for ${product.name}`);
        error.statusCode = 400;
        return next(error);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price, // Use DB price, not client price
      });
    }

    // Calculate total quantity
    const totalQuantity = validatedItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    // Apply discount logic (10% if 5+ items)
    const discountPercentage = totalQuantity >= 5 ? 10 : 0;
    const discountAmount = (subtotal * discountPercentage) / 100;
    const totalAmount = subtotal - discountAmount;

    // Create order
    const order = await ORDER.create({
      user: req.user._id,
      items: validatedItems,
      subtotal,
      discountPercentage,
      discountAmount,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    // Update product stock
    for (const item of validatedItems) {
      await PRODUCT.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createOrder };
