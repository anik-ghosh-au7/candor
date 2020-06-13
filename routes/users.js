const express = require ('express');
const user_controller = require ('../controller/user.controller');
const jwt = require ('jsonwebtoken');
require('dotenv').config();
const userValidator = require('../validator/user.validator');

const authenticateToken = (req, res, next) => {
  const token = req.cookies['awtToken'];
  if (!token) res.status(401).send({msg: 'Unauthorized Access'});

  jwt.verify(token, process.env.jwt_key, (err, user) => {
    if (err) return res.status(403).send({msg: 'Unauthorized Forbidden'});
    req.user = user;
    next()
  });
};
const authenticateTokenLogin = (req, res, next) => {
  const token = req.cookies['awtToken'];
  if (!token) {
    next()
  }else{
    jwt.verify(token, process.env.jwt_key, (err, user) => {
    if (err) return res.status(403).send({msg: 'Unauthorized Forbidden'});
    req.user = user;
    next()
  });
  }


};

const router = express.Router();


router.post('/createuser',authenticateTokenLogin, [userValidator.check_username(), userValidator.check_email(), userValidator.check_password(), userValidator.check_phone()], user_controller.createUser);

router.post('/login',authenticateTokenLogin, user_controller.login);

router.get('/login',authenticateTokenLogin, user_controller.login);

// router.get('/logout',user_controller.logout);

// router.post('/getposts', authenticateToken, user_controller.getposts)

module.exports = router;
