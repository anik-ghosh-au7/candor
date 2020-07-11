"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _post = require("../controller/post.controller");

var _dotenv = _interopRequireDefault(require("dotenv"));

var router = _express["default"].Router();

_dotenv["default"].config();

var authenticateToken = function authenticateToken(req, res, next) {
  var token = req.cookies['awtToken'];

  if (!token) {
    return res.redirect('/users/loginPage');
  }

  _jsonwebtoken["default"].verify(token, process.env.jwt_key, function (err, user) {
    if (err) return res.status(403).send({
      msg: 'Unauthorized Forbidden'
    });
    req.user = user;
    next();
  });
};

router.post('/addpost', authenticateToken, _post.post_controller.createPost);
router.post('/addcomment', authenticateToken, _post.post_controller.createComment);
router.get('/render', authenticateToken, _post.post_controller.renderPost);
router.get('/getdata', authenticateToken, _post.post_controller.getdata);
router.get('/like', authenticateToken, _post.post_controller.updateLike);
router.get('/tags', _post.post_controller.getTrendingTags);
router.post('/addfav', authenticateToken, _post.post_controller.favouriteUsers);
module.exports = router;
//# sourceMappingURL=post.js.map