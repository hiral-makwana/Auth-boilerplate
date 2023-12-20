import { Router } from 'express';
import * as userController from '../controller/user.controller';
import userValidator from '../validator/user.validator';

const router = Router();

/** User Registration */
router.post('/register', userValidator.registerUser(), userController.registerUser);

/** Verify OTP received in email */
router.post('/verifyOtp', userValidator.verifyOTP(), userController.verifyOTP);

/** Resend OTP on email */
router.post('/resendOtp', userValidator.resendOTP(), userController.resendOTP);

/** Forgot password using Email */
router.post('/forgotPassword', userValidator.forgotPw(), userController.forgotPassword);

/** Reset password */
router.post('/resetPassword', userValidator.resetPw(), userController.resetPassword);

/** Login */
router.post('/login', userValidator.login(), userController.logIn);

export default router;
