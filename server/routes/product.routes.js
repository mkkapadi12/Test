const express = require("express");
const adminMiddleware = require("../middlewares/admin.middleware");
const productController = require("../controllers/product.controller");
const upload = require("../middlewares/upload.middleware");
const router = express.Router();

//public
router.get("/all", productController.getAllproducts);

//only for admin access
router.post(
  "/admin/create",
  upload.array("images"),
  adminMiddleware,
  productController.addProduct,
);

router.put("/admin/:id", adminMiddleware, productController.updateProductById);

router.delete(
  "/admin/delete/:id",
  adminMiddleware,
  productController.deletedProductById,
);

module.exports = router;
