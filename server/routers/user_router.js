import { Router } from 'express';
import { login, signup, renderlogin, rendersignup } from "../controllers/users.js"
import { checkNotAuthenticated } from '../middleware/auth.js'

const router = Router()

router.post('/login', checkNotAuthenticated, login);
router.get('/login', checkNotAuthenticated, renderlogin)
router.post('/signup', checkNotAuthenticated, checkNotAuthenticated, signup);
router.get('/signup', checkNotAuthenticated, rendersignup)

export default router;
