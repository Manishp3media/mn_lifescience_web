import express from "express";
import { createBanner, getAllBanners, deleteBanner } from "../controllers/banner.js";
import authMiddleware from "../middleware/auth.js";
import { uploadBannerImage } from "../middleware/uploadDocuments.js";

const router = express.Router();

router.post("/admin/add/banner",authMiddleware('admin'), uploadBannerImage, createBanner);
router.get("/admin/get/banners",authMiddleware('admin'), getAllBanners);
router.delete("/admin/delete/banner",authMiddleware('admin'), deleteBanner);

export default router;