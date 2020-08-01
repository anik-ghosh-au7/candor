import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import {video_emit} from '../controller/communication.controller';
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
router.get('/video',authenticateToken, (req, res, next) => {
    // res.render('video',{room: decodeURIComponent(req.query.current_url)});
    res.render('video');
    });

  
  module.exports = router;