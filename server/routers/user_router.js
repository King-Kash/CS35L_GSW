import { Router } from 'express';
import { login, getUsers, signup } from "../controllers/users.js"

const router = Router()

router.post('/login', login);
router.get('/getUsers', getUsers);
router.post('/signup', signup);

export default router;
