import { Router } from 'express';
import { login, signup} from "../controllers/users.js"
import { checkNotAuthenticated } from '../middleware/auth.js'
import { addReview, deleteReview } from "../controllers/reviews.js";

const router = Router()

router.post('/login', checkNotAuthenticated, login);
router.post('/signup', checkNotAuthenticated, checkNotAuthenticated, signup);

router.post("/addReview/", addReview); // Route to add a review
router.delete("/deleteReview/:id", deleteReview); // Route to delete a review by ID

export default router;
