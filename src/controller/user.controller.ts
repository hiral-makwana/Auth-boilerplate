import { Request } from "express";
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { generateHash } from '../helper/utils';
import config from '../config/config.json';
import Sequelize, { Op } from 'sequelize';

export const getListOfUser = async (req: Request, res: any) => {
    try {
        let getUsersData: any = await User.findAll({})
        return res.status(200).send({ status: true, message: res.__("SUCCESS_FETCHED"), data: getUsersData })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ status: false, message: e.message })
    }
}

export const changePassword = async (req: any, res: any) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Find the user by ID
        const user: any = await User.findByPk(userId);

        if (!user) {
            return res.status(401).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

        // Check if the provided old password matches the hashed password in the database
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: res.__("INVALID_PASSWORD"),
            });
        }

        const isPasswordMatch = await bcrypt.compare(newPassword, user.password);

        if (isPasswordMatch) {
            return res.status(401).json({
                status: false,
                message: res.__("PASSWORD_MATCH"),
            });
        }
        // Hash the new password
        const hashedNewPassword = await generateHash(newPassword);

        // Update the user's password in the database
        await User.update({ password: hashedNewPassword }, { where: { id: userId } });

        return res.status(200).json({
            status: true,
            message: res.__("CHANGE_PASSWORD"),
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}

export const checkValidation = async (req: any, res: any) => {
    try {
        const { key, value } = req.body;

        // Get all attributes (fields) of the User model
        const userAttributes = Object.keys(User.getAttributes());
        const filteredAttributes = userAttributes.filter(attribute => attribute !== 'createdAt' && attribute !== 'updatedAt');

        // Build a dynamic query to check if the specified value exists in any field
        const query = {
            [Sequelize.Op.or]: filteredAttributes.map(field => ({
                [field]: value
            }))
        };
        // Check if the specified value exists in any field of the user table
        const existingUser = await User.findOne({ where: query });

        //check value using given key
        // const keyExists = await User.findOne({ where: { [key]: value } });
        // if (keyExists) {
        //     const fieldWithValue = Object.keys(keyExists.dataValues).find(
        //         (field) => keyExists.dataValues[field] === value
        //     );

        //     if (fieldWithValue) {
        //         return res.status(400).json({
        //             status: false,
        //             message: res.__("VALUE_EXIST") + ` ${fieldWithValue}`,
        //         });
        //     }
        // }

        if (existingUser) {
            // Determine the field where the value was found
            const foundField = userAttributes.find(field => existingUser[field] === value);

            // If foundField is not undefined, a matching field was found
            if (foundField !== undefined) {
                return res.status(409).json({
                    status: false,
                    message: `Value '${value}' already exists in the user table in field '${foundField}'.`
                });
            }
        }
        return res.status(200).json({ status: true, message: res.__("VALIDATION_OK") });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}

export const deleteUser = async (req: any, res: any) => {
    try {
        const userId = req.params.userId;
        const user: any = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }
        if (!config.HARD_DELETE) {
            const modelAttributes = Object.keys(User.getAttributes());
            if (!modelAttributes.includes('isDeleted')) {
                return res.status(500).json({ status: false, message: res.__("FIELD_NOT_FOUND") });
            }

            const softDeleteResult = await User.update(
                { isDeleted: true },
                { where: { id: userId, isDeleted: { [Op.or]: [false, null] } } }
            );

            if (softDeleteResult[0] === 1) {
                return res.status(200).json({ status: true, message: res.__("USER_DELETED") });
            } else {
                return res.status(404).json({ status: false, message: res.__("USER_NOT_FOUND") });
            }
        } else {
            const result = await User.destroy({ where: { id: userId } });

            if (result === 1) {
                return res.status(200).json({ status: true, message: res.__("USER_DELETED") });
            } else {
                return res.status(404).json({ status: false, message: res.__("USER_NOT_FOUND") });
            }
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}

export const profileUpload = async (req: any, res: any) => {
    try {
        const userId = req.params.userId;
        const profileImage = req.file;
        if (!profileImage) {
            return res.status(400).json({ status: false, message: res.__("IMAGE_NOT_SELECTED") });
        }
        const userAttributes = Object.keys(User.getAttributes());
        if (!userAttributes.includes('profileImage')) {
            return res.status(400).json({ status: false, message: res.__('IMAGE_FIELD_NOT_EXIST') });
        }

        console.log(profileImage)
        // Update the profileImage field in the database
        const [updatedRows] = await User.update(
            { profileImage: profileImage.filename },
            { where: { id: userId } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ status: false, message: res.__('USER_NOT_FOUND') });
        }
        return res.status(200).json({ status: true, message: res.__('IMAGE_UPLOADED'), data: config.BASE_URL + `/${profileImage.destination}` + profileImage.filename });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}

export const convertHtmlToString = async (req: any, res: any) => {
    try {
        let htmlData = '';

        if (req.headers['content-type'] === 'text/html') {
            //Concatenate chunks of data
            req.on('data', (chunk: any) => {
                htmlData += chunk;
            });
            req.on('end', () => {
                if (!htmlData) {
                    return res.status(400).json({ status: false, message: res.__("HTML_REQUIRED") });
                }
                const text = htmlData.replace(/\n/g, '').replace(/\s{2,}/g, ' '); //JSON.stringify(reqData);
                res.status(200).json({ success: true, message: res.__('HTML_CONVERTED'), data: text });
            });
        }
        else {
            res.status(200).json({ success: false, message: 'Invalid content type(Expected text/html). Select HTML for request.' });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}