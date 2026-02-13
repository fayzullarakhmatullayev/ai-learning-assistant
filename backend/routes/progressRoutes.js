import { Router } from 'express';
import * as progressController from '../controllers/progressController.js';
import protect from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/dashboard', progressController.getDashboard);

export default router;
