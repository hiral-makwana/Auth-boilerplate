"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = __importStar(require("../controller/user.controller"));
const user_validator_1 = __importDefault(require("../validator/user.validator"));
const router = (0, express_1.Router)();
/** User Registration */
router.post('/register', user_validator_1.default.registerUser(), userController.registerUser);
/** Verify OTP received in email */
router.post('/verifyOtp', user_validator_1.default.verifyOTP(), userController.verifyOTP);
/** Resend OTP on email */
router.post('/resendOtp', user_validator_1.default.resendOTP(), userController.resendOTP);
/** Forgot password using Email */
router.post('/forgotPassword', user_validator_1.default.forgotPw(), userController.forgotPassword);
/** Reset password */
router.post('/resetPassword', user_validator_1.default.resetPw(), userController.resetPassword);
/** Login */
router.post('/login', user_validator_1.default.login(), userController.logIn);
exports.default = router;
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
//# sourceMappingURL=auth.route.js.map