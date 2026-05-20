import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: { email: string; password: string }) => {
    const { email, password } = payload;

    const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1
    `, [email]);
    const user = userData.rows[0];

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const jwtpayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
    }

    const accessToken = jwt.sign(jwtpayload, config.jwtSecret as string, { expiresIn: '1d' });

    const refreshToken = jwt.sign(jwtpayload, config.refresh_Secret as string, { expiresIn: '1d' });

    return {
        accessToken,
        refreshToken
    }

}

const generateRefreshToken = async (token: string) => {

    if (!token) {
        throw new Error('Access denied. No token provided.');
    }

    const decoded = jwt.verify(token as string, config.refresh_Secret as string) as jwt.JwtPayload;

    const userData = await pool.query(`
            SELECT * FROM users WHERE email = $1
        `, [decoded.email]);

    const user = userData.rows[0];

    if (userData.rows.length === 0) {
        throw new Error('User not found');
    }

    if (!user.is_active) {
        throw new Error('User is not active');
    }

    const jwtpayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
    }

    const accessToken = jwt.sign(jwtpayload, config.jwtSecret as string, { expiresIn: '1d' });

    return {
        accessToken
    }


};

export const authService = {
    loginUserIntoDB,
    generateRefreshToken
}