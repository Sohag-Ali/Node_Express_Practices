
import express, { type Application, type Request, type Response } from 'express';
import { pool } from './db';
import { userRoute } from './modules/user/user.route';

const app: Application = express()


app.use(express.json())
app.use(express.text())


app.use('/api/users', userRoute)

app.get('/api/users', userRoute)

app.get('/api/users/:id', userRoute)



app.put('/api/users/:id', userRoute)

app.delete('/api/users/:id', userRoute)


export default app;