import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import http from 'http';
import ioLib from 'socket.io';
const io = ioLib(http);
dotenv.config();
const router = express.Router();

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

  /* GET chat page. */
router.get('/',authenticateToken, (req, res, next) => {
    console.log('chat url --> ', decodeURIComponent(req.query.current_url));
    res.render('chat',{room: decodeURIComponent(req.query.current_url)});
    });
  
  module.exports = router;