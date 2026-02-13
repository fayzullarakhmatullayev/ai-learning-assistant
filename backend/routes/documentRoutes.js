import { Router } from 'express';
import * as documentController from '../controllers/documentController.js';
import protect from '../middleware/auth.js';
import uploadMiddleware from '../config/multer.js';

const router = Router();

router.use(protect);
router.post('/upload', uploadMiddleware, documentController.uploadDocument);
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocument);
router.delete('/:id', documentController.deleteDocument);

export default router;
