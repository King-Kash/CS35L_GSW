import express from 'express';
import { connectDB } from './config/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const app = express();
connectDB();
dotenv.config();


const posts = [
    {
        username: "Kash",
        title: "Post 1"
    },
    {
        username: "Aki",
        title: "Post 1"
    }
]



app.get("/posts", authenticateToken, (req,res) => {
    res.json(posts)
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken}) //access token has user information saved in it
});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
});

app.post('/login', (req, res) => {
    const username = req.body.username
    const user = {name: username}

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken}) //access token has user information saved in it
})

function authenticateToken(red, res, nex) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split('')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = usernext()
    })
}