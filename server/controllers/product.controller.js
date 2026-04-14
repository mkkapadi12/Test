const PRODUCT = require("../models/product.model");

//User and Admin can both access

const getAllproducts = async (req, res, next) => {
  try {
    const products = await PRODUCT.find();

    return res.status(200).json({
      msg: "Product Fetched !",
      products,
    });
  } catch (error) {
    return next(error);
  }
};

//add product
const addProduct = async (req, res, next) => {
  try {
    const { name, quantity, price, exp_date } = req.body;

    // image upload pending from frontend side, so commenting the code for now
    // if (!req.files) {
    //   const error = new Error("No file uploaded");
    //   error.statusCode = 400;
    //   return next(error);
    // }

    const images = req.files?.map((file) => {
      return file.path;
    });

    const product = await PRODUCT.create({
      name,
      quantity,
      price,
      exp_date,
      images: images,
      createdBy: req.admin._id,
    });

    return res.status(201).json({
      msg: "Product Added !!",
      product,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

//update product
const updateProductById = async (req, res, next) => {
  try {
    const updateData = req.body;
    const { id } = req.params;

    const product = await PRODUCT.findById(id);

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    const updatedProduct = await PRODUCT.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      msg: "Product Updated !",
      product: updatedProduct,
    });
  } catch (error) {
    return next(error);
  }
};

const deletedProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await PRODUCT.findById(id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }
    await PRODUCT.findByIdAndDelete(id);
    return res.status(200).json({
      msg: "Product Deleted !",
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  addProduct,
  getAllproducts,
  updateProductById,
  deletedProductById,
};
