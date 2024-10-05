import express from 'express';
import { addToCart, getCart, removeFromCart } from "../controllers/cart.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post('/user/add/cart', authMiddleware('user'), addToCart); // Add to cart
router.get('/user/get/cart', authMiddleware('user'), getCart); // Get user cart
router.delete('/user/delete/cart', authMiddleware('user'), removeFromCart); // Remove from cart

export default router;
