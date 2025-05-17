import express from "express";
import { addReview, deleteReview } from "../controllers/reviews.js";
// TODO: import authentication middleware, pass auth token to the routes

const router = express.Router();

router.post("/addReview/", addReview); // Route to add a review
router.delete("/deleteReview/:id", deleteReview); // Route to delete a review by ID

export default router;