"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

_dotenv["default"].config();

var router = _express["default"].Router();

var authenticateToken = function authenticateToken(req, res, next) {
  var token = req.cookies['awtToken'];

  if (!token) {
    return res.redirect('/users/loginPage');
  }

  _jsonwebtoken["default"].verify(token, process.env.jwt_key, function (err, data) {
    if (err) return res.status(403).send({
      msg: 'Unauthorized access'
    });
    req.user = data;
    next();
  });
};
/* GET chat page. */


router.get('/video', authenticateToken, function (req, res, next) {
  // res.render('video',{room: decodeURIComponent(req.query.current_url)});
  res.render('video');
});
module.exports = router;
//# sourceMappingURL=communication.route.js.map