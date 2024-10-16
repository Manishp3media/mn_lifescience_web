import express from "express";
import { addSocialMediaLink, getAllSocialMediaLinks } from "../controllers/socialMediaLink.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/admin/add/socialMediaLink",authMiddleware('admin'), addSocialMediaLink);
router.get("/admin/get/socialMediaLinks",authMiddleware('admin'), getAllSocialMediaLinks);
router.get("/user/get/socialMediaLinks",authMiddleware('user'), getAllSocialMediaLinks);
router.patch("/admin/edit/socialMediaLink",authMiddleware('admin'), addSocialMediaLink);

export default router;
