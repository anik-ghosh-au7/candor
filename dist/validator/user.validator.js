"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _expressValidator = require("express-validator");

var _user = _interopRequireDefault(require("../model/user.model"));

var is_unique = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data, type) {
    var obj, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (type === 'email') {
              obj = {
                email: data
              };
            } else if (type === 'username') {
              obj = {
                username: data
              };
            }

            result = null;
            _context.next = 4;
            return _user["default"].findOne(obj, function (err, data) {
              if (err) {
                // Internal server error
                res.status(500).send({
                  msg: "Internal Server Error"
                });
              } else {
                if (data === null) {
                  console.log('returning unique');
                  result = true;
                } else {
                  console.log('returning not unique');
                  result = false;
                }
              }

              ;
            });

          case 4:
            return _context.abrupt("return", result);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function is_unique(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var user_validator = {};

user_validator.check_username = function () {
  return (0, _expressValidator.check)('username').not().isEmpty().custom( /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(username) {
      var result;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return is_unique(username, 'username');

            case 2:
              result = _context2.sent;
              console.log(result);

              if (result) {
                _context2.next = 7;
                break;
              }

              console.log('User name taken');
              throw new Error('User name taken');

            case 7:
              console.log('unique username');
              return _context2.abrupt("return", username);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3) {
      return _ref2.apply(this, arguments);
    };
  }());
};

user_validator.check_email = function () {
  return (0, _expressValidator.check)('email').not().isEmpty().isEmail().custom( /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(email) {
      var result;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return is_unique(email, 'email');

            case 2:
              result = _context3.sent;
              console.log(result);

              if (result) {
                _context3.next = 7;
                break;
              }

              console.log('Email taken');
              throw new Error('Email taken');

            case 7:
              console.log('unique email');
              return _context3.abrupt("return", email);

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x4) {
      return _ref3.apply(this, arguments);
    };
  }());
};

user_validator.check_password = function () {
  return (0, _expressValidator.check)('password').not().isEmpty();
};

user_validator.check_phone = function () {
  return (0, _expressValidator.check)('phone').not().isEmpty().isMobilePhone();
};

module.exports = user_validator;
//# sourceMappingURL=user.validator.js.map