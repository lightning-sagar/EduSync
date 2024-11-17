import express from 'express';
import { loginController,updateController, logoutController, signupController } from '../Controllers/UserController.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/Login',loginController);
router.post('/logout',logoutController);
router.put('/update',updateController);


export default router;
