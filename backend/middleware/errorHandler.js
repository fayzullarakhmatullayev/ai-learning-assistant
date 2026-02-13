const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode || 500;
  let message = err.message || 'Server errror';

  console.log('catched____', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
    statusCode = 400;
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File size exceeds the maximum limit of 10MB';
    statusCode = 400;
  }
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }
  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  console.error('Error:', {
    message,
    stack: process.env.NODE_ENV === 'development' && err.stack
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Multer error handler wrapper
export const handleMulterError = (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      // Multer error occurred
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size exceeds the maximum limit of 10MB',
          statusCode: 400
        });
      }

      if (err.message === 'Only PDF files are allowed') {
        return res.status(400).json({
          success: false,
          error: 'Only PDF files are allowed',
          statusCode: 400
        });
      }

      // Other multer errors
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload error',
        statusCode: 400
      });
    }

    // No error, proceed to controller
    next();
  });
};

export default errorHandler;
