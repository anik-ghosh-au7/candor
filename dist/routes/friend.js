"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _friend = _interopRequireDefault(require("../controller/friend.controller"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

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

router.post('/friendrequest', authenticateToken, _friend["default"].addFriend);
router.get('/respondtorequest', authenticateToken, _friend["default"].respondToRequest);
router.get('/getallfriends', authenticateToken, _friend["default"].getAllFriends);
module.exports = router;
//# sourceMappingURL=friend.js.map