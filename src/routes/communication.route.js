import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import {sendToReceiver} from '../controller/communication.controller';
dotenv.config();
const router = express.Router();

const authenticateToken = (req, res, next) => {
    const token = req.cookies['awtToken'];
    if (!token) {
      return res.redirect('/users/loginPage');
    }
    jwt.verify(token, process.env.jwt_key, (err, data) => {
      if (err) return res.status(403).send({msg: 'Unauthorized access'});
      req.user = data;
      next();
    });
  };

  /* GET chat page. */
// router.get('/video',authenticateToken, sendToReceiver);

router.get('/video',authenticateToken, (req, res) => {
  res.render('video');
});

  module.exports = router;
