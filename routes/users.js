const express = require ('express');
const user_controller = require ('../controller/user.controller');
const jwt = require ('jsonwebtoken');
require('dotenv').config();
const userValidator = require('../validator/user.validator');

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

router.post('/createuser',authenticateToken, [userValidator.check_username(), userValidator.check_email(), userValidator.check_password(), userValidator.check_phone()], user_controller.createUser);

router.post('/login',authenticateToken, user_controller.login);

router.get('/loginPage',authenticateToken, user_controller.loginPage);

router.get('/signPage',authenticateToken, user_controller.signPage);

router.get('/logout',user_controller.logout);

router.get('/submit_otp',user_controller.submit_otp);



// router.post('/getposts', authenticateToken, user_controller.getposts)

module.exports = router;
