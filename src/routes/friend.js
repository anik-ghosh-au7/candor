import express from 'express';
import friend_controller from '../controller/friend.controller';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
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
router.post('/friendrequest', authenticateToken, friend_controller.addFriend);

router.get('/respondtorequest', authenticateToken, friend_controller.respondToRequest);

router.get('/getallfriends',authenticateToken,friend_controller.getAllFriends);

module.exports = router;
