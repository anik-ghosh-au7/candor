"use strict";

var express = require('express');

var router = express.Router();

var jwt = require('jsonwebtoken');

var _require = require('express'),
    request = _require.request;

var _require2 = require('../controller/post.controller'),
    post_controller = _require2.post_controller,
    app = _require2.app;

require('dotenv').config();

var authenticateToken = function authenticateToken(req, res, next) {
  var token = req.cookies['awtToken'];

  if (!token) {
    return res.redirect('/users/loginPage');
  }

  jwt.verify(token, process.env.jwt_key, function (err, user) {
    if (err) return res.status(403).send({
      msg: 'Unauthorized Forbidden'
    });
    req.user = user;
    next();
  });
};

router.post('/addpost', authenticateToken, post_controller.createPost);
router.post('/addcomment', authenticateToken, post_controller.createComment);
router.get('/render', authenticateToken, post_controller.renderPost);
router.get('/getdata', post_controller.getdata);
router.get('/like', authenticateToken, post_controller.updateLike);
router.get('/tags', post_controller.getTrendingTags);
module.exports = router;
//# sourceMappingURL=post.js.map