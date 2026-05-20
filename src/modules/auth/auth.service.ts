import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async(payload: { email: string; password: string }) => {
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
        is_active: user.is_active,
    }

    const accessToken = jwt.sign(jwtpayload, config.jwtSecret as string, { expiresIn: '1d' });

    return {
        accessToken
    }
    
}

export const authService = {
    loginUserIntoDB
}