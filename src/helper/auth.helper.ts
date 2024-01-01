import jwt from 'jsonwebtoken';

// function to generate token
const generateToken = function (user: any) {
    try {
        let payload = user;

        // Ensure that JWT_SECRET and JWT_EXPIRATION_TIME are available in the config
        if (!global.global.config.JWT_SECRET || !global.global.config.JWT_EXPIRATION_TIME) {
            throw new Error('Missing configuration: JWT_SECRET or JWT_EXPIRATION_TIME is not defined in the configuration.');
        }
        const token = jwt.sign(payload, global.config.JWT_SECRET, { expiresIn: global.config.JWT_EXPIRATION_TIME })
        // Ensure that a valid token is generated
        if (!token || typeof token !== 'string' || token.trim().length === 0) {
            throw new Error('Error generating JWT: Invalid token value.');
        }

        return token
    }
    catch (e: any) {
        console.log(e)
    }
}

export { generateToken }