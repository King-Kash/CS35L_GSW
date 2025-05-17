import express from 'express';
import { connectDB } from './config/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import reviewRoutes from "./routers/review_router.js";
import locationRoutes from './routers/location_router.js';

const app = express();
app.use(express.json());
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

app.use(express.json()); // Middleware to parse JSON
app.use("/reviews", reviewRoutes); // Add review routes at /reviews
app.use("/locations", locationRoutes); // Add location routes at /locations

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