declare const router: import("express-serve-static-core").Router;
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
