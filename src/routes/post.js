import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import {post_controller} from '../controller/post.controller';
import dotenv from 'dotenv';
dotenv.config();


const authenticateToken = (req, res, next) => {
    const token = req.cookies['awtToken'];
    if (!token) {
        return res.redirect('/users/loginPage');
    }
    jwt.verify(token, process.env.jwt_key, (err, user) => {
        if (err) return res.status(403).send({msg: 'Unauthorized Forbidden'});
        req.user = user;
        next()
    });
};

router.post('/addpost', authenticateToken, post_controller.createPost);
router.post('/addcomment',authenticateToken,post_controller.createComment);
router.get('/render',authenticateToken, post_controller.renderPost);
router.get('/getdata',authenticateToken, post_controller.getdata);
router.get('/like',authenticateToken,post_controller.updateLike);
router.get('/tags',post_controller.getTrendingTags);
router.post('/addfav', authenticateToken, post_controller.favouriteUsers);
module.exports = router;
