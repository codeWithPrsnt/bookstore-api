import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler.js';


const authenticate = (req, res, next) => {
 
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return next(new AppError('No token provided', 403));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError('Invalid token format', 403));
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new AppError('Invalid token', 401));
    }

   
    req.user = decoded;
    next();
  });
};

export default authenticate;
