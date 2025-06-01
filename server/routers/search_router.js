import express from "express";
import { search, getRecommendations } from "../controllers/search.js";
import { checkAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Route for search functionality
router.post("/", search);

// Route for user recommendations (requires authentication)
router.get("/recommendations", checkAuthenticated, getRecommendations);

export default router; 