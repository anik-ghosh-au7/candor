"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _user = _interopRequireDefault(require("../controller/user.controller"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _user2 = _interopRequireDefault(require("../validator/user.validator"));

var _multer = _interopRequireDefault(require("../utils/multer"));

_dotenv["default"].config();

var authenticateToken = function authenticateToken(req, res, next) {
  var token = req.cookies['awtToken'];

  if (!token) {
    next();
  } else {
    _jsonwebtoken["default"].verify(token, process.env.jwt_key, function (err, data) {
      if (err) return res.status(403).send({
        msg: 'Unauthorized Forbidden'
      });
      req.user = data.name;
      next();
    });
  }
};

var router = _express["default"].Router();

router.post('/request_otp', _user["default"].request_otp);
router.post('/createuser', authenticateToken, _multer["default"], [_user2["default"].check_username(), _user2["default"].check_email(), _user2["default"].check_password(), _user2["default"].check_phone()], _user["default"].createUser);
router.post('/login', authenticateToken, _user["default"].login);
router.get('/loginPage', authenticateToken, _user["default"].loginPage);
router.get('/signPage', authenticateToken, _user["default"].signPage);
router.get('/logout', _user["default"].logout);
router.get('/submit_otp', _user["default"].submit_otp);
router.post('/subscribe', authenticateToken, _user["default"].setSubscription);
module.exports = router;
//# sourceMappingURL=users.js.map