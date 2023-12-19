import { Router } from 'express';
import * as userController from '../controller/user.controller';
import userValidator from '../validator/user.validator';
import { verifyToken } from '../middleware/verifyToken';
import { upload } from '../helper/mediaUpload';

const router = Router();

/** Get all users */
router.get('/list', userController.getListOfUser);

/** Change Password after login */
router.post('/changePassword', userValidator.changePw(), verifyToken, userController.changePassword);

/** Check validations */
router.post('/checkValidation', userValidator.checkValid(), verifyToken, userController.checkValidation);

/** Delete user API */
router.delete('/deleteUser/:userId', verifyToken, userController.deleteUser);

/** HTML to String */
router.post('/htmlToString', userController.convertHtmlToString);

/** Upload Profile */
router.post('/upload/:userId', verifyToken, upload.single('avatar'), userController.profileUpload);

export default router;
