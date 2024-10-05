import express from "express";
import { createProduct, getAllProducts, getProductsByCategory, getProductById } from "../controllers/product.js";
import authMiddleware from "../middleware/auth.js";
import { get } from "mongoose";

const router = express.Router();

// Create Product
router.post("/admin/create/product",authMiddleware('admin'), createProduct);

// Get All Products in Admin
router.get("/admin/get/products",authMiddleware('admin'), getAllProducts);

// Get All Products in User
router.get("/user/get/products",authMiddleware('user'), getAllProducts);

// Get All Products By Category in User
router.get("/user/get/category/products/:category",authMiddleware('user'), getProductsByCategory);

// Get Product By ID
router.get("/user/get/product/:id",authMiddleware('user'), getProductById);

export default router;