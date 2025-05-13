import { Router } from 'express';
import { login, getUsers, signup, renderlogin, rendersignup } from "../controllers/users.js"

const router = Router()

router.post('/login', login);
router.get('/login', renderlogin)
router.get('/getUsers', getUsers);
router.post('/signup', signup);
router.get('/signup', rendersignup)

export default router;
