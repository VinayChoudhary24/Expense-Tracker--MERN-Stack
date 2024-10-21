import { Request, Response, NextFunction } from 'express';

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization'];

  if (!token) {
    res.status(401).json({
      success: 0,
      response: [],
      message: 'Access denied. No token provided.',
    });
  } else {
    console.log("Token-Attached")
    next();
  }
};

export default authenticate;