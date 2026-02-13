import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { __dirname } from '../utils/pathDirname.js';
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || '10485760';

const uploadDir = path.join(__dirname, '../uploads/documents');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// File filter - only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('ONLY_PDF_FILES'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(MAX_FILE_SIZE) }
});

export const uploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // Handle Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size exceeds the maximum limit of 10MB',
          statusCode: 400
        });
      }

      if (err.message === 'ONLY_PDF_FILES') {
        return res.status(400).json({
          success: false,
          error: 'Only PDF files are allowed',
          statusCode: 400
        });
      }

      // Other Multer errors
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload error',
        statusCode: 400
      });
    }

    // No error, proceed
    next();
  });
};

export default uploadMiddleware;
