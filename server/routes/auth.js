import express from 'express';
import { userSignup, userLogin, createAdmin, adminLogin, editAdmin } from '../controllers/auth.js';

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/admin/signup', createAdmin);
router.post('/user/signup', userSignup);
router.post('/user/login', userLogin);
router.patch('/admin/change-credentials/:id', editAdmin);

export default router;