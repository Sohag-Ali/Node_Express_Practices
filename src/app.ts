
import express, { type Application, type Request, type Response } from 'express';
import { userRoute } from './modules/user/user.route';
import { profileRoute } from './modules/profile/profile.route';
import { authRoute } from './modules/auth/auth.route';

const app: Application = express()


app.use(express.json())
// app.use(express.text())


app.use('/api/users', userRoute)
app.use('/api/profiles', profileRoute)
app.use('/api/auth', authRoute)





export default app;