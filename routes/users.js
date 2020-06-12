const express = require ('express');
const user_controller = require ('../controller/user.controller');
const { check } = require ('express-validator');
const jwt = require ('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) res.status(401).send({msg: 'Unauthorized Access'});

  jwt.verify(token, jwt_key, (err, user) => {
    if (err) return res.status(403).send({msg: 'Unauthorized Forbidden'});
    req.user = user;
    next()
  });
};

const router = express.Router();

router.get('/alluser', user_controller.getAllUser);

router.get('/user/', user_controller.getUser);

router.post('/createuser', [check('username').not().isEmpty(), check('password').not().isEmpty()], user_controller.createUser);

router.patch('/updateuser/:id', [check('username').not().isEmpty(), check('password').not().isEmpty()], user_controller.updateUser);

router.delete('/deleteuser', user_controller.deleteUser);

router.post('/login', user_controller.login);

router.post('/getposts', authenticateToken, user_controller.getposts)

module.exports = router;
