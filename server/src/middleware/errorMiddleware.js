// server/src/middleware/errorMiddleware.js

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

//Express identifies this as an error handling middleware function
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error('[ERROR] ${req.method} ${req.url} - ${message}');

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
    });
}

