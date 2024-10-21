import express from 'express';
import { loginUser, registerUser } from '../controllers/userController';
// import { registerUser } from '../controllers/userController';

const router = express.Router();

router.post('/api/user/register', registerUser);
router.post('/api/user/login', loginUser);


export default router;