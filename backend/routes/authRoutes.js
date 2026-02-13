import { Router } from 'express';

import * as authController from '../controllers/authController.js';
import * as authValidation from '../validations/authValidation.js';

import protect from '../middleware/auth.js';

const router = Router();

// Public Routes
router.post('/register', authValidation.registerValidation, authController.register);
router.post('/login', authValidation.loginValidation, authController.login);

// Protected Routes
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);
router.post('/change-password', protect, authController.changePassword);

export default router;
