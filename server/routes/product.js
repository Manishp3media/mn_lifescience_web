import express from "express";
import { createProduct, getAllProducts, getProductsByCategory, getProductById, updateProductStatus, bulkUploadProducts, addProductImages } from "../controllers/product.js";
import authMiddleware from "../middleware/auth.js";
import { uploadProductImage, uploadExcelFile } from "../middleware/uploadDocuments.js";
import { deleteProduct, editProduct, deleteProductImage } from "../utils/cloudinary.js";

const router = express.Router();

// Create Product
router.post("/admin/create/product",authMiddleware('admin'),  uploadProductImage, createProduct);

// Get All Products in Admin
router.get("/admin/get/products",authMiddleware('admin'), getAllProducts);

// Get All Products in User
router.get("/user/get/products",authMiddleware('user'), getAllProducts);

// Get All Products By Category in User
router.get("/user/get/category/products/:category",authMiddleware('user'), getProductsByCategory);

// Get Product By ID
router.get("/user/get/product/:id",authMiddleware('user'), getProductById);

// Delete Product
router.delete("/admin/delete/product",authMiddleware('admin'), deleteProduct);

// Edit Product
router.patch("/admin/edit/product",authMiddleware('admin'), uploadProductImage, editProduct);

// Update Product Status
router.patch('/admin/update/status', updateProductStatus);

/// Bulk upload route (Excel file handling)
router.post("/admin/products/bulk/upload", authMiddleware('admin'), uploadExcelFile, bulkUploadProducts);

// add images
router.patch("/admin/add/product/images",authMiddleware('admin'), uploadProductImage, addProductImages);

// delete images
router.delete("/admin/delete/product/images",authMiddleware('admin'), deleteProductImage);

export default router;