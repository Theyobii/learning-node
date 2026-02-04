import express, { application } from 'express';
import { port, SECRET_JWT_KEY } from './config.js'; 
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import UserRepository from './user-repository.js';
import { parse } from 'zod';

const app = express();
app.set('view engine', 'ejs')

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  const token = req.cookies['access_token']
  let username = null

   if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_JWT_KEY)
            username = decoded.username
        } catch (error) {
            console.error('Token inválido', error)
        }
   }
   res.render('index', { username })
})

app.post('/login' , async (req, res) => {
    const {username, password} = req.body
    try {
        const user = await UserRepository.login({ username, password })
        const token = jwt.sign({ user: user._id, username }, SECRET_JWT_KEY, { expiresIn: '1h' })
        res
        
        .cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        })
        .send({ user, token })
    } catch (error) {
        res.status(401).send({ error: error.message })
    }
})

app.post('/register' , async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)

    try { 
        const userId = await UserRepository.create({ username, password })
        res.status(201).send({ userId })
    } catch (error) {
        res.status(400).send({ error: error.message })
    } 
})

app.post('/logout' , (req, res) => {
    res.clearCookie('access_token')
    res.sendStatus(200)
})

app.get('/protected', (req, res) => {
    const token = req.cookies.access_token
    if (!token) {
        return res.status(401).send('Acceso denegado. No se proporcionó token.')
    }

    try {
        const data = jwt.verify(token, SECRET_JWT_KEY)
        res.render('protected', data) // {id, username}
    } catch (error) {
        res.status(401).send('Token inválido')
    }
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
})