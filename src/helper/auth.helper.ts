import jwt from 'jsonwebtoken'
import config from '../config/config.json';

// function to generate token
const generateToken = function (user: any) {
    try {
        let payload = user
        const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION_TIME })
        return token
    }
    catch (e: any) {
        console.log(e)
    }
}

export { generateToken }