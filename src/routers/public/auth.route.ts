import { Router } from 'express';
import * as authController from '../../controller/auth.controller';
import authValidator from '../../validator/auth.validator';

const router = Router();

/** User Registration */
router.post('/register', authValidator.registerUser(), authController.registerUser);

/** Verify OTP received in email */
router.post('/verifyOtp', authValidator.verifyOTP(), authController.verifyOTP);

/** Resend OTP on email */
router.post('/resendOtp', authValidator.resendOTP(), authController.resendOTP);

/** Forgot password using Email */
router.post('/forgotPassword', authValidator.forgotPassword(), authController.forgotPassword);

/** Reset password */
router.post('/resetPassword', authValidator.resetPassword(), authController.resetPassword);

/** Login */
router.post('/login', authValidator.login(), authController.logIn);

/**Refresh token */
router.post('/refreshToken', authValidator.refreshTokens(), authController.refreshToken);

export default router;

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication] 
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         description: The preferred language for the response.
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             messages:
 *               email: "invalid email format"
 *               required: "email is required"
 *             firstName: "Test"
 *             lastName: "User"
 *             email: "user@example.com"
 *             password: "String@123"
 *             phoneNumber: "8965613143"
 *             roleId: 1
 *     responses:
 *       200:
 *         description: Successful response with registration status
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Registartion successfully.
 */
/**
* @swagger
* /verifyOTP:
*   post:
*     summary: Verify OTP for user registration
*     tags: [Authentication]
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
*     requestBody:
*       description: OTP verification data
*       required: true
*       content:
*         application/json:
*           example:
*             type: register
*             email: john.doe@example.com
*             otp: 123456
*     responses:
*       200:
*         description: Successful response with verification status
*         content:
*           application/json:
*             example:
*               status: true
*               message: "Otp is verfied successfully."
*               isVerified: true
*               loginType: register
*       400:
*         description: Invalid request or OTP verification failed
*         content:
*           application/json:
*             example:
*               status: false
*               message: INVALID_TYPE 'register'
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             example:
*               status: false
*               message: Internal server error.
*/
/**
* @swagger
* /resendOTP:
*   post:
*     summary: Resend OTP for user registration
*     tags: [Authentication]
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
*     requestBody:
*       description: Resend OTP data
*       required: true
*       content:
*         application/json:
*           example:
*             type: forgot
*             email: john.doe@example.com
*     responses:
*       200:
*         description: Successful response with OTP resend status
*         content:
*           application/json:
*             example:
*               status: true
*               message: OTP sent successfully.
*       400:
*         description: Invalid request or user not found
*         content:
*           application/json:
*             example:
*               status: false
*               message: INVALID_TYPE 'forgot'
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             example:
*               status: false
*               message: Internal server error.
*/
/**
* @swagger
* /forgotPassword:
*   post:
*     summary: Send OTP for password reset
*     tags: [Authentication]
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
*     requestBody:
*       description: Email for password reset OTP
*       required: true
*       content:
*         application/json:
*           example:
*             email: john.doe@example.com
*     responses:
*       200:
*         description: Successful response with OTP sent status
*         content:
*           application/json:
*             example:
*               status: true
*               message: OTP sent successfully.
*       400:
*         description: Invalid request or user not found
*         content:
*           application/json:
*             example:
*               status: false
*               message: User not found.
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             example:
*               status: false
*               message: Internal server error.
*/
/**
* @swagger
* /resetPassword:
*   post:
*     summary: Reset user password
*     tags: [Authentication]
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
*     requestBody:
*       description: User email and new password
*       required: true
*       content:
*         application/json:
*           example:
*             email: john.doe@example.com
*             password: newPassword123
*     responses:
*       200:
*         description: Successful response with password reset status
*         content:
*           application/json:
*             example:
*               status: true
*               message: Password reset successfully.
*               data:
*                 userId: 123
*                 email: john.doe@example.com
*       400:
*         description: Invalid request or user not found
*         content:
*           application/json:
*             example:
*               status: false
*               message: User not found.
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             example:
*               status: false
*               message: Internal server error.
*/
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication APIs
 * /refreshToken:
 *   post:
 *     summary: Refresh an authentication token
 *     tags: [Authentication]
 *     requestBody:
 *       description: Token to refresh
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             token: "your_token_here"
 *     responses:
 *       200:
 *         description: Successful response with refreshed token
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Token reset successfully
 *               data:
 *                 userId: 123
 *                 email: "user@example.com"
 *                 token: "new_refreshed_token_here"
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Token expired or invalid
 *       404:
 *         description: Token not found in the request
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Token not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Server error during token refresh
 */
