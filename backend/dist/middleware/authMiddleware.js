"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err)
                return res.status(403).json({ message: 'Invalid token' });
            req.user = user;
            next();
        });
    }
    else {
        res.status(401).json({ message: 'Authorization header missing' });
    }
};
exports.default = authenticateJWT;
