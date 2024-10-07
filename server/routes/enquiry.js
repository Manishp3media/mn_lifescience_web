import express from "express";
import { createEnquiry, getEnquiries, updateEnquiryStatus } from "../controllers/enquiry.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/user/create/enquiry", authMiddleware('user'), createEnquiry);

router.get("/admin/get/enquiries", authMiddleware('admin'), getEnquiries);

router.patch("/admin/update/enquiry/status", authMiddleware('admin'), updateEnquiryStatus);

export default router