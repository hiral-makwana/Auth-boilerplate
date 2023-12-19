
const keyName = 'otp'
const requestType = {
    REGISTER: 'register',
    FORGOT: 'forgot'
}

const status = {
    ACTIVE: 'active',
    DEACTIVE: 'deactive',
    DELETED: 'deleted',
};
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

export { keyName, requestType, passwordRegex, status} 