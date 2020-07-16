"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var io = (0, _socket["default"])(_http["default"]);

_dotenv["default"].config();

var router = _express["default"].Router();

var authenticateToken = function authenticateToken(req, res, next) {
  var token = req.cookies['awtToken'];

  if (!token) {
    return res.redirect('/users/loginPage');
  }

  _jsonwebtoken["default"].verify(token, process.env.jwt_key, function (err, data) {
    if (err) return res.status(403).send({
      msg: 'Unauthorized Forbidden'
    });
    req.user = data;
    next();
  });
};
/* GET chat page. */


router.get('/', authenticateToken, function (req, res, next) {
  console.log('chat url --> ', decodeURIComponent(req.query.current_url));
  res.render('chat', {
    room: decodeURIComponent(req.query.current_url)
  });
});
module.exports = router;
//# sourceMappingURL=chat.js.map