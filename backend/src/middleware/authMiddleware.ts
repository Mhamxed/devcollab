import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'
dotenv.config()

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.SECRET_KEY!, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        
        req.user = user; 
        next();
        });
    } else {
        res.status(401).json({ message: 'Authorization header missing' });
    }
};

export default authenticateJWT;