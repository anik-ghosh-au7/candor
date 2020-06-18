var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const {request} = require('express');
var {post_controller,app} = require('../controller/post.controller');


const authenticateToken = (req, res, next) => {
    const token = req.cookies['awtToken'];
    if (!token) {
        return res.redirect('/users/loginPage');
    }
    jwt.verify(token, 'verysecretkey', (err, user) => {
        if (err) return res.status(403).send({msg: 'Unauthorized Forbidden'});
        req.user = user;
        next()
    });
};

// router.post('/',authenticateToken, );
// router.post('/',authenticateToken, );
// router.get('/',authenticateToken, );

router.post('/addpost', authenticateToken, post_controller.createPost);
router.post('/addcomment',authenticateToken,post_controller.createComment);
router.get('/render',authenticateToken,post_controller.renderPost);

module.exports = router;
