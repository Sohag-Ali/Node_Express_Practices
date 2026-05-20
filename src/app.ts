
import express, { type Application, type Request, type Response } from 'express';
import { userRoute } from './modules/user/user.route';
import { profileRoute } from './modules/profile/profile.route';
import { authRoute } from './modules/auth/auth.route';
import logger from './middleware/logger';
import CookieParser from 'cookie-parser';

const app: Application = express()

app.use(CookieParser())
app.use(express.json())

app.use(logger)

app.use('/api/users', userRoute)
app.use('/api/profiles', profileRoute)
app.use('/api/auth', authRoute)

export default app;