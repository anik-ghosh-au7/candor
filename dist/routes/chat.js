"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

var router = _express["default"].Router();

var authenticateToken = function authenticateToken(req, res, next) {
  var token = req.cookies['awtToken'];

  if (!token) {
    return res.redirect('/users/loginPage');
  }

  jwt.verify(token, process.env.jwt_key, function (err, data) {
    if (err) return res.status(403).send({
      msg: 'Unauthorized Forbidden'
    });
    req.user = data;
    next();
  });
};
/* GET chat page. */


router.get('/', authenticateToken, function (req, res, next) {
  res.render('chat', req.user);
});
module.exports = router;
//# sourceMappingURL=chat.js.map