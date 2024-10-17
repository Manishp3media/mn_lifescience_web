import express from 'express';
import {  userLogin, createAdmin, adminLogin, editAdmin, getUsers, editUser, getUser } from '../controllers/auth.js';
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/admin/signup', createAdmin);
// router.post('/user/signup', userSignup);
router.post('/user/login', userLogin);

// Get Users
router.get('/admin/get/users',authMiddleware("admin"), getUsers);

// Get User
router.get('/user/get/:id',authMiddleware("user"), getUser);

// Edit Admin
router.patch('/admin/change-credentials/:id', editAdmin);

// Edit User
router.patch('/user/edit/:id', editUser);

export default router;