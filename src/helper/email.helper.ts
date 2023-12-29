import fs from 'fs';
import nodemailer from 'nodemailer';
import config from '../config/config.json';
import path from 'path';
let emailConfig = null;

/**
 * Initialize the email configuration.
 */

emailConfig = {
    host: config.SMTP_CONFIG && config.SMTP_CONFIG.host ? config.SMTP_CONFIG.host : 'localhost',
    port: config.SMTP_CONFIG && config.SMTP_CONFIG.port ? config.SMTP_CONFIG.port : 25,
    //secure: config.SMTP_CONFIG && config.SMTP_CONFIG?.secure ? config.SMTP_CONFIG.secure : false,
    auth: {
        user: config.SMTP_CONFIG && config.SMTP_CONFIG.user ? config.SMTP_CONFIG.user : null,
        pass: config.SMTP_CONFIG && config.SMTP_CONFIG.password ? config.SMTP_CONFIG.password : null,
    }
};

/**
 * Update the email configuration dynamically.
 * @param {Object} config - Email configuration object.
 */
function updateEmailConfig(config: any) {
    const configPath = path.join('src', 'config.json');
    console.log(configPath);
    try {
        if (!fs.existsSync(configPath)) {
            return { status: false, message: 'Config file not found.' }
        }

        const configFileContent = fs.readFileSync(configPath, 'utf-8');
        const currentConfig = JSON.parse(configFileContent);

        if (!currentConfig.SMTP_CONFIG) {
            return { status: false, message: 'mailConfig object not found in the config file.' }
        }

        currentConfig.SMTP_CONFIG.host = config.host;
        currentConfig.SMTP_CONFIG.port = config.port;
        currentConfig.SMTP_CONFIG.user = config.user;
        currentConfig.SMTP_CONFIG.password = config.password;

        const updatedConfigContent = JSON.stringify(currentConfig, null, 2);

        fs.writeFileSync(configPath, updatedConfigContent, 'utf-8');

        return { status: true, message: 'Config updated successfully!' }
    } catch (error) {
        console.error('Error updating config:', error);
        throw new Error(error);
    }
}

/**
 * Send an email using the configured email settings.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} message - HTML content for the email message.
 * @returns {Promise<void>} A Promise that resolves when the email is sent successfully.
 */
function sendEmail(to: any, subject: string, message: any) {
    return new Promise<void>((resolve, reject) => {
        let transporter = null;
        if (config.SMTP == true) {
            if (!emailConfig) {
                return Promise.reject(new Error('Email configuration is not initialized. update the config file to set up the email configuration.'));
            }
            // Create a Nodemailer transporter with the provided email configuration
            transporter = nodemailer.createTransport(emailConfig);
        }
        else {
            transporter = nodemailer.createTransport({
                sendmail: true,
                newline: 'unix',
                path: '/usr/sbin/sendmail'
            })
        }
        // Email data with HTML message
        const mailOptions = {
            from: emailConfig.user,
            to: to,
            subject: subject,
            html: message
        };

        // Send the email
        transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
            if (error) {
                console.error('Email could not be sent:', error);
                reject(error);
            } else {
                console.log('Email sent:', info.response);
                resolve();
            }
        });
    });
}

export {
    updateEmailConfig,
    sendEmail,
};
