import express from 'express';
import { connectDB } from './config/db.js';


const app = express();


app.get("/", (req,res) => {
    res.send("Server is ready.")
});

app.listen(3000, () => {
    connectDB()
    console.log('Server started at http://localhost:3000');
});
