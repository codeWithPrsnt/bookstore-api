class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  const handleError = (err, req, res, next) => {
    if (err.isOperational) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'Something went wrong!' });
  };
  
export { AppError, handleError };
  