
import express, { type Application, type Request, type Response } from 'express';
import { userRoute } from './modules/user/user.route';
import { profileRoute } from './modules/profile/profile.route';

const app: Application = express()


app.use(express.json())
// app.use(express.text())


app.use('/api/users', userRoute)
app.use('/api/profiles', profileRoute)

// app.post('/api/profile', profileRoute)
// app.get('/api/users', userRoute)
// app.get('/api/users/:id', userRoute)
// app.put('/api/users/:id', userRoute)
// app.delete('/api/users/:id', userRoute)




export default app;