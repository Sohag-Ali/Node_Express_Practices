import express, { type Application, type Request, type Response } from 'express';
import {Pool} from 'pg';

const app : Application = express()
const port = 3000

app.use(express.json())
app.use(express.text())

const pool = new Pool({
    connectionString : "postgresql://neondb_owner:npg_oDKvgYP27wfR@ep-solitary-art-aqylsrv5-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                age INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            `)
            console.log('Database initialized successfully!')
    } catch (error) {
        console.log(error)
    }
}

initDB();

app.get('/api/users', async (req : Request  , res : Response) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json({
            success: true,
            message: 'users fetched successfully!' ,
            data: result.rows
        })
    } catch (error:any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users!' ,
            error: error
        })
        
    }
})

app.get('/api/users/:id', async (req : Request  , res : Response) => {
  
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT * FROM users WHERE id = $1
        `, [id]);

        if(result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found!' ,
            })
        }   

        res.status(200).json({
            success: true,
            message: 'user fetched successfully!' ,
            data: result.rows[0]
        })
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user!' ,
            error: error
        })
    }
})

app.post('/api/users', async (req : Request  , res : Response) => {
    const { name, email, password, age } = req.body
    const result = await pool.query(`
        INSERT INTO users (name, email, password, age)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [name, email, password, age])

   try {
     res.status(200).json({
        success: true,
         message: 'user created successfully!' ,
         data: result.rows[0]
        })
   } catch (error: any) {
     res.status(500).json({
        success: false,
         message: 'Error creating user!' ,
         error: error,
        })
   }
})

app.put('/api/users/:id', async (req : Request  , res : Response) => {
    const { id } = req.params;
    const { name, email, password, age } = req.body

    try {
        const result = await pool.query(`
            UPDATE users 
            SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password), age = COALESCE($4, age), updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *
        `, [name, email, password, age, id])

        if(result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found!' ,
            })
        }

        res.status(200).json({
            success: true,
            message: 'user updated successfully!' ,
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating user!' ,
            error: error
        })
    }
})

app.delete('/api/users/:id', async (req : Request  , res : Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM users WHERE id = $1 RETURNING *
        `, [id])

        if(result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found!' ,
            })
        }

        res.status(200).json({
            success: true,
            message: 'user deleted successfully!' ,
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user!' ,
            error: error
        })
    }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})