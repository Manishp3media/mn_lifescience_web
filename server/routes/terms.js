import express from 'express';
import { getTerms, updateTerms } from "../controllers/terms";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET terms and conditions
router.get('/terms', authMiddleware('admin'), getTerms);

// PUT update terms and conditions (Admin only)
router.put('/terms', authMiddleware('admin'), updateTerms);

export default router;
