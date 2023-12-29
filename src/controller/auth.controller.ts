import { User, status } from '../models/user.model';
import bcrypt from 'bcrypt';
import { sendEmail } from '../helper/email.helper'
import { keyName, requestType } from "../helper/constant";
import { generateRandomOtp, generateHash, generateOtpHtmlMessage } from '../helper/utils'
import { UserMeta } from '../models/userMeta.model';
import { generateToken } from '../helper/auth.helper';
import config from '../config/config.json';
import path from 'path';
import jwt from 'jsonwebtoken';

const otpHtmlTemplatePath = path.join('src', 'otpTemplate.html');
const resendOtpTemplatePath = path.join('src', 'resendOtpTemplate.html');

export const registerUser = async (req: any, res: any) => {
    try {
        const reqData = req.body
        let jsonObj: any = {
            firstName: reqData.firstName,
            lastName: reqData.lastName,
            email: reqData.email,
            password: reqData.password,
            phoneNumber: reqData.phoneNumber,
            roleId: reqData.roleId ? reqData.roleId : 2,
            isVerified: false,
            ...reqData
        };

        const hashedPassword = await generateHash(reqData.password);
        jsonObj.password = hashedPassword
        // check if already exists
        let user: any = await User.findOne({ where: { email: reqData.email } });
        if (user && user.status == status.DEACTIVE) {
            await User.update(jsonObj, { where: { email: reqData.email } })
            return res.status(200).send({ status: true, message: res.__("SUCCESS_UPDATE") })
        }
        else if (user && user.status == status.ACTIVE) {
            return res.status(200).send({ status: true, message: res.__("ALREADY_REGISTERED") })
        }
        else {
            let createUser = await User.create(jsonObj)
            if (createUser) {
                // HTML content for the OTP email
                let getRandomOtp = await generateRandomOtp(6)
                let metaObj = {
                    userId: createUser.dataValues.id,
                    key: keyName,
                    value: getRandomOtp.toString()
                }
                await UserMeta.create(metaObj)
                let customOtpHtmlTemplate = otpHtmlTemplatePath
                if (config.CUSTOM_TEMPLATE == true) {
                    if (reqData.customOtpHtmlTemplate == undefined || reqData.customOtpHtmlTemplate == '') {
                        return res.status(200).send({ status: true, message: res.__("TEMPLATE_NOT_DEFINE") })
                    }
                    else {
                        customOtpHtmlTemplate = reqData.customOtpHtmlTemplate
                    }
                }
                const templatedata = {
                    username: jsonObj.firstName,
                    otpCode: getRandomOtp
                }
                const otpHtmlMessage = await generateOtpHtmlMessage(jsonObj.email, config.CUSTOM_TEMPLATE, customOtpHtmlTemplate, "Registration done successfully.Here is your OTP for varification.", templatedata);

                return res.status(200).send({ status: true, message: res.__("SUCCESS_CREATE") })
            }
            else {
                return res.send({ status: false, message: res.__("FAIL_CREATE") })
            }
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).send({ status: false, message: res.__("SERVER_ERR", e.message) })
    }
}

export const verifyOTP = async (req: any, res: any) => {
    try {
        const { type, email, otp } = req.body;

        // Ensure the type is 'register' as specified in the requirement
        if (type !== requestType.REGISTER) {
            return res.status(400).json({
                status: false,
                message: res.__("INVALID_TYPE") + `'${requestType.REGISTER}'`,
            });
        }

        // Find the user with the provided email and status
        const user: any = await User.findOne({ where: { email }, raw: true });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }
        if (user && user.status == status.ACTIVE) {
            return res.status(400).json({
                status: false,
                message: res.__("ALREADY_VERIFIED"),
            });
        }

        const userMeta = await UserMeta.findOne({ where: { userId: user.id, key: keyName } });
        if (!userMeta || userMeta.value !== otp.toString()) {
            return res.status(400).json({
                status: false,
                message: res.__("INVALID_OTP"),
            });
        }

        // Update the user's status to 'ACTIVE' or as needed
        await User.update({ status: status.ACTIVE, isVerified: true }, { where: { email } });
        await UserMeta.update({ value: null }, { where: { userId: user.id, key: keyName } })
        return res.status(200).json({
            status: true,
            message: res.__("OTP_VERIFIED"),
            isVerified: true,
            loginType: requestType.REGISTER,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}

export const resendOTP = async (req: any, res: any) => {
    try {
        const { type, email, customOtpHtmlTemplate } = req.body;

        // Ensure the type is 'forgot' as specified in the requirement
        if (type !== requestType.FORGOT) {
            return res.status(400).json({
                status: false,
                message: res.__("INVALID_TYPE") + `'${requestType.FORGOT}'`,
            });
        }

        const user: any = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

        // Generate a new OTP
        const newOTP = await generateRandomOtp(6);

        // Update the user's OTP in the database
        await UserMeta.update({ value: newOTP.toString() }, { where: { userId: user.id, key: keyName } });

        // Send the new OTP to the user's email
        let customTemplate = resendOtpTemplatePath
        if (config.CUSTOM_TEMPLATE == true) {
            if (customOtpHtmlTemplate == undefined || customOtpHtmlTemplate == '') {
                return res.status(200).send({ status: true, message: res.__("TEMPLATE_NOT_DEFINE") })
            }
            else {
                customTemplate = customOtpHtmlTemplate
            }
        }
        const templatedata = {
            username: user.firstName,
            otpCode: newOTP
        }
        const otpHtmlMessage = await generateOtpHtmlMessage(user.email, config.CUSTOM_TEMPLATE, customTemplate, "OTP Verification.", templatedata);

        return res.status(200).json({
            status: true,
            message: res.__("SENT_OTP"),
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}

export const forgotPassword = async (req: any, res: any) => {
    try {
        const { email } = req.body;

        // Find the user with the provided email
        const user: any = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

        // Generate a new OTP
        const newOTP = await generateRandomOtp(6);

        // Update the user's OTP in the user_meta table
        await UserMeta.update({ value: newOTP.toString() }, {
            where: { userId: user.id, key: keyName },
        });

        // Send the new OTP to the user's email
        const otpHtmlMessage = `<p>Your new OTP code for update password: <b>${newOTP}</b></p>`;
        sendEmail(email, "Forgot Password OTP", otpHtmlMessage);

        return res.status(200).json({
            status: true,
            message: res.__("SENT_OTP"),
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}

export const resetPassword = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        // Find the user with the provided email
        const user: any = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

        // Hash the new password
        const hashedPassword = await generateHash(password);

        // Update the user's password and set OTP
        await Promise.all([
            User.update({ password: hashedPassword }, { where: { id: user.id } }),
            UserMeta.update({ value: null }, { where: { userId: user.id, key: keyName } }),
        ]);

        return res.status(200).json({
            status: true,
            message: res.__("RESET_PASSWORD"),
            data: {
                userId: user.id,
                email: user.email,
            },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}

export const logIn = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        // Find the user with the provided email
        const user: any = await User.findOne({ where: { email } });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({
                status: false,
                message: res.__("INVALID_EMAIL")
            });
        }

        // Check if the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: res.__("INVALID_EMAIL")
            });
        }

        const isVerified = user.isVerified ? true : false
        if (!isVerified) {
            return res.status(401).json({
                status: false,
                message: res.__("NOT_VERIFIED")
            });
        }
        //generate a JWT token
        const token = await generateToken({ id: user.id, email: user.email });

        // Return the authentication response
        return res.status(200).json({
            status: true,
            message: res.__("LOGIN_SUCCESS"),
            data: {
                userId: user.id,
                email: user.email,
                token,
            },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}

export const refreshToken = async (req: any, res: any) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(404).json({
                status: false,
                message: res.__("TOKEN_NOT_FOUND"),
            });
        }

        jwt.verify(token, config.JWT_SECRET, (err: any, user: any) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        status: false,
                        message: res.__("TOKEN_EXPIRED")
                    });
                } else {
                    return res.status(401).json({
                        status: false,
                        message: res.__("INVALID_TOKEN")
                    });
                }
            }

            const refreshToken = generateToken({ id: user.id, email: user.email });

            return res.status(200).json({
                status: true,
                message: res.__("TOKEN_RESET"),
                data: {
                    userId: user.id,
                    email: user.email,
                    token: refreshToken,
                },
            });
        });
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
};