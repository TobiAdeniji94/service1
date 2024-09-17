import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  customerId?: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('token from header', token)

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
    req.customerId = decoded.id;
    console.log('decoded auth middleware:', decoded)
    next();
  } catch (err) {
    console.error('jwt error:', err)
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
