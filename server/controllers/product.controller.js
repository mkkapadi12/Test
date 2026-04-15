const uploadToCloudinary = require("../utils/uploadToCloudinary");
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
    const { name, stock, price, exp_date, discount } = req.body;

    //product image upload
    const Images = req.files || [];

    if (Images.length === 0) {
      const error = new Error("No image uploaded");
      error.statusCode = 400;
      return next(error);
    }

    const uploadedImages = await Promise.all(
      Images.map(async (file, index) => {
        const result = await uploadToCloudinary(file.buffer).then((res) => {
          return {
            url: res.url,
            public_id: res.public_id,
            isPrimary: index === 0,
          };
        });
        return result;
      }),
    );

    const product = await PRODUCT.create({
      name,
      stock,
      price,
      exp_date,
      images: uploadedImages,
      discount,
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
      msg: "Product Updated !!",
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
      msg: "Product Deleted!!",
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
