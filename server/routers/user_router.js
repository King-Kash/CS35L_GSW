import { Router } from 'express';
import { login, getUsers } from "../controllers/users.js"

const router = Router()

router.post('/login', login);
router.get('/getUsers', getUsers);

export default router;
