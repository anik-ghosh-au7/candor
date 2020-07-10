"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _message = _interopRequireDefault(require("../controller/message.controller"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

var authenticateToken = function authenticateToken(req, res, next) {
  var token = req.cookies['awtToken'];

  if (!token) {
    return res.redirect('/users/loginPage');
  }

  _jsonwebtoken["default"].verify(token, process.env.jwt_key, function (err, data) {
    if (err) return res.status(403).send({
      msg: 'Unauthorized Forbidden'
    });
    req.user = data; // console.log(data);

    next();
  });
};

var router = _express["default"].Router();

router.post('/', authenticateToken, _message["default"].handle_messages);
router.get('/getmsg', authenticateToken, _message["default"].getmsg);
module.exports = router;
//# sourceMappingURL=message.js.map