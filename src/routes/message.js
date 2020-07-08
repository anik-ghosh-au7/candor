import express from 'express';
import message_controller from '../controller/message.controller';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const authenticateToken = (req, res, next) => {
    const token = req.cookies['awtToken'];
    if (!token) {
      return res.redirect('/users/loginPage');
    }
    jwt.verify(token, process.env.jwt_key, (err, data) => {
      if (err) return res.status(403).send({msg: 'Unauthorized Forbidden'});
      req.user = data;
      next();
    });
  };
const router= express.Router();

router.post('/',authenticateToken,message_controller.handle_messages);

module.exports=router;
