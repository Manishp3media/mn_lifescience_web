import express from 'express';
import { userSignup, userLogin, createAdmin, adminLogin, editAdmin, getUsers } from '../controllers/auth.js';
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/admin/signup', createAdmin);
router.post('/user/signup', userSignup);
router.post('/user/login', userLogin);

// Get Users
router.get('/admin/get/users',authMiddleware("admin"), getUsers);

// Edit Admin
router.patch('/admin/change-credentials/:id', editAdmin);

export default router;