import express from 'express';
import AuthController from './auth.controller';
import { loginSchema } from './auth.validation';
import validateRequest from '@/app/middlewares/validateRequest';
const router = express.Router();

router.post('/login', validateRequest(loginSchema), AuthController.authLogin);
router.get('/me', AuthController.authMe);

export const AuthRoutes = router;
