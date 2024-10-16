import express from "express";
import { createCategory, getAllCategories } from "../controllers/category.js";
import authMiddleware from "../middleware/auth.js";
import { uploadCategoryLogo } from "../middleware/uploadDocuments.js";

const router = express.Router();

// Create Category
router.post("/admin/create/category",authMiddleware('admin'), uploadCategoryLogo, createCategory);

// Get All Categories in Admin
router.get("/admin/get/categories",authMiddleware('admin'), getAllCategories);

// Get All Categories in User
router.get("/user/get/categories",authMiddleware('user'), getAllCategories);

export default router;