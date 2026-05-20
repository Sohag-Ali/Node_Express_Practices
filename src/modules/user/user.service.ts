import { pool } from "../../db"


const creteUserIntoDB = async (payload: any) => {
    const { name, email, password, age } = payload;
    const result = await pool.query(`
        INSERT INTO users (name, email, password, age)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [name, email, password, age]);

    return result;
}

const getUserFromDB = async () => {
    
        const result = await pool.query('SELECT * FROM users');
        return result;
}

const getUserByIdFromDB = async (id: string) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result;
    
}

const updateUserInDB = async (id: string, payload: any) => {
    const { name, email, password, age } = payload;
    const result = await pool.query(`
            UPDATE users 
            SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password), age = COALESCE($4, age), updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *
        `, [name, email, password, age, id])
    return result;
}

const deleteUserFromDB = async (id: string) => {
    const result = await pool.query(`
            DELETE FROM users WHERE id = $1 RETURNING *
        `, [id])
    return result;
}

export const userService = {
    creteUserIntoDB,
    getUserFromDB,
    getUserByIdFromDB,
    updateUserInDB,
    deleteUserFromDB
}
    
