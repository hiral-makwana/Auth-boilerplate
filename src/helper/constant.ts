
const keyName = 'otp'
const requestType = {
    REGISTER: 'register',
    FORGOT: 'forgot',
    REFRESH: 'refresh'
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

export { keyName, requestType, passwordRegex } 