import express from 'express';
import user_controller from '../controller/user.controller';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import userValidator from '../validator/user.validator';
import cloudUpload from '../utils/multer';

const authenticateToken = (req, res, next) => {
  const token = req.cookies['awtToken'];
  if (!token) {
    next()
  }else{
    jwt.verify(token, process.env.jwt_key, (err, data) => {
    if (err) return res.status(403).send({msg: 'Unauthorized Forbidden'});
    req.user = data.name;
    next()
  });
  }


};

const router = express.Router();

router.post('/request_otp',user_controller.request_otp);

router.post('/createuser',authenticateToken, cloudUpload, [userValidator.check_username(), userValidator.check_email(), userValidator.check_password(), userValidator.check_phone()], user_controller.createUser);

router.post('/login',authenticateToken, user_controller.login);

router.get('/loginPage',authenticateToken, user_controller.loginPage);

router.get('/signPage',authenticateToken, user_controller.signPage);

router.get('/logout',user_controller.logout);

router.get('/submit_otp',user_controller.submit_otp);


module.exports = router;
