import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { UserAuthService } from '../services/implementations/userAuth.service.js';

const userAuthService = new UserAuthService();
const authController = new AuthController(userAuthService);

const router = Router();

router.post('/signup', (req, res, next) => authController.signup(req, res, next));
router.post('/verify-otp', (req, res, next) => authController.verifyOTP(req, res, next));
router.post('/resend-otp', (req, res, next) => authController.resendOTP(req, res, next));

export default router;