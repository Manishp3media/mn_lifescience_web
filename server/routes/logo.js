import express from "express";
import { createLogo, editLogo, getLogo } from "../controllers/Logo.js";
import authMiddleware from "../middleware/auth.js";
import { uploadLogoImage } from "../middleware/uploadDocuments.js";

const router = express.Router();

router.post("/admin/add/logo",authMiddleware('admin'), uploadLogoImage, createLogo);
router.patch("/admin/edit/logo",authMiddleware('admin'), uploadLogoImage, editLogo);

// Get Logo
router.get("/admin/get/logo",authMiddleware('admin'), getLogo);

export default router;