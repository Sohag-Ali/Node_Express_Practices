import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import config from "../config";
import { pool } from "../db";
import type { Role } from "../types";



const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        try {
             const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token as string, config.jwtSecret as string) as jwt.JwtPayload;

        const userData = await pool.query(`
            SELECT * FROM users WHERE email = $1
        `, [decoded.email]);

        const user = userData.rows[0];

        if (userData.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: ' User not found.' });
        }

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'User is not active.' });
        }

        if(roles.length && !roles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You do not have permission to access this resource.' });
        }

        req.user = user;
        

        next();
    
        } catch (error) {
            next(error);
            
        }

    }

}

export default auth;