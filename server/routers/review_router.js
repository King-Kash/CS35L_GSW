import express from "express";
import { addReview, deleteReview, getReviews, getTags } from "../controllers/reviews.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

const router = express.Router();

router.get("/", getReviews); // Route to get all reviews with optional filtering
router.post("/addReview/", addReview); // Route to add a review
//router.post("/addReview/", authenticateToken, addReview); // Route to add a review with authentication
router.delete("/deleteReview/:id", deleteReview); // Route to delete a review by ID
router.get("/tags", getTags);

export default router;



