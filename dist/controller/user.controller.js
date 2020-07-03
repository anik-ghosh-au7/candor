"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _user = _interopRequireDefault(require("../model/user.model"));

var _expressValidator = require("express-validator");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cloudinary = _interopRequireDefault(require("../utils/cloudinary"));

var _convertBuffToStr = _interopRequireDefault(require("../utils/convertBuffToStr"));

_dotenv["default"].config();

var dict = {};
var image_url;
var imageContent;
var user_controller = {
  //
  createUser: function () {
    var _createUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
      var errors, hashed_password, entry;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!req.user) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", res.redirect('/'));

            case 2:
              errors = (0, _expressValidator.validationResult)(req);

              if (!(!dict[req.body.email] || dict[req.body.email][0] !== req.body.OTP)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", res.status(400).send('Wrong OTP '));

            case 5:
              if (errors.isEmpty()) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", res.status(422).json({
                errors: errors.array()
              }));

            case 7:
              ;

              if (!req.file) {
                _context.next = 12;
                break;
              }

              imageContent = (0, _convertBuffToStr["default"])(req.file.originalname, req.file.buffer).content;
              _context.next = 12;
              return _cloudinary["default"].uploader.upload(imageContent, function (err, imageResponse) {
                if (err) console.log(err);else {
                  image_url = imageResponse.secure_url;
                  console.log('log from cloudinary', image_url);
                }
              });

            case 12:
              _context.prev = 12;
              _context.next = 15;
              return _bcrypt["default"].hash(req.body.password, 5);

            case 15:
              hashed_password = _context.sent;
              entry = new _user["default"]({
                username: req.body.username,
                password: hashed_password,
                email: req.body.email,
                phone: req.body.phone,
                image_url: image_url
              });

              if (!entry.image_url) {
                delete entry.image_url;
              }

              console.log(entry);
              entry.save(function (err) {
                if (err) {
                  // not acceptable
                  res.status(406).send(err.message);
                } else {
                  // created
                  res.render('login');
                }
              });
              _context.next = 25;
              break;

            case 22:
              _context.prev = 22;
              _context.t0 = _context["catch"](12);
              res.status(500).send('Internal error occured');

            case 25:
              ;

            case 26:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[12, 22]]);
    }));

    function createUser(_x, _x2) {
      return _createUser.apply(this, arguments);
    }

    return createUser;
  }(),
  login: function login(req, res) {
    if (req.user) {
      return res.redirect('/');
    }

    var username = req.body.username;
    var password = req.body.password;

    _user["default"].findOne({
      username: username
    }, /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err, data) {
        var accessToken;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!err) {
                  _context2.next = 4;
                  break;
                }

                // Internal server error
                res.status(500).send({
                  msg: "Internal Server Error"
                });
                _context2.next = 24;
                break;

              case 4:
                if (!data) {
                  _context2.next = 23;
                  break;
                }

                _context2.prev = 5;
                _context2.next = 8;
                return _bcrypt["default"].compare(password, data.password);

              case 8:
                if (!_context2.sent) {
                  _context2.next = 14;
                  break;
                }

                accessToken = _jsonwebtoken["default"].sign({
                  name: username,
                  img: data.image_url,
                  email: data.email,
                  phone: data.phone
                }, process.env.jwt_key); // res.cookie('awtToken', accessToken, {maxAge: 9000000, httpOnly: true});

                res.cookie('awtToken', accessToken, {
                  maxAge: 9000000
                });
                return _context2.abrupt("return", res.redirect('/'));

              case 14:
                res.status(401).send('Unauthorized access');

              case 15:
                _context2.next = 21;
                break;

              case 17:
                _context2.prev = 17;
                _context2.t0 = _context2["catch"](5);
                console.log(_context2.t0);
                res.status(400).send('Bad request');

              case 21:
                _context2.next = 24;
                break;

              case 23:
                // no data
                res.redirect('/');

              case 24:
                ;

              case 25:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[5, 17]]);
      }));

      return function (_x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }());
  },
  loginPage: function loginPage(req, res) {
    if (req.user) {
      return res.redirect('/');
    }

    res.render('login');
  },
  signPage: function signPage(req, res) {
    if (req.user) {
      return res.redirect('/');
    }

    res.render('signUp');
  },
  request_otp: function request_otp(req, res) {
    var email = req.body.email;
    var otp = generateOTP();
    console.log(otp);

    if (dict[email]) {
      clearInterval(dict[email][1]);
      delete dict[email];
    }

    dict[email] = [otp, clearOTP(dict, email)];

    function main() {
      return _main.apply(this, arguments);
    }

    function _main() {
      _main = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var testAccount, transporter, info;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _nodemailer["default"].createTestAccount();

              case 2:
                testAccount = _context3.sent;
                transporter = _nodemailer["default"].createTransport({
                  service: 'gmail',
                  host: 'smtp.gmail.com',
                  auth: {
                    user: process.env.email_otp_id,
                    port: 465,
                    secure: true,
                    pass: process.env.email_otp_password
                  }
                });
                _context3.next = 6;
                return transporter.sendMail({
                  from: "Candor ",
                  to: email,
                  subject: "OTP from Candor",
                  text: "For sign up to Candor, please use this OTP ".concat(otp, ". This OTP will be valid for 30 mins"),
                  // plain text body
                  html: "<b><H2>For sign up, please use this OTP ".concat(otp, "</H2><br> OTP will be valid for 30 mins</b>") // html body

                });

              case 6:
                info = _context3.sent;

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return _main.apply(this, arguments);
    }

    main().then(function () {
      return res.send('OTP sent');
    })["catch"](function () {
      console.error();
    });
  },
  submit_otp: function submit_otp(req, res) {
    var otp = req.query.otp;
    var email = req.query.email;

    if (dict[email] && dict[email][0] === otp) {
      res.send('OTP verified');
    } else {
      res.send('Wrong OTP');
    }
  },
  logout: function logout(req, res) {
    res.clearCookie('awtToken');
    res.render('logged_out');
  }
};

function generateOTP() {
  var digits = '0123456789';
  var OTP = '';

  for (var i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
}

function clearOTP(dict, key) {
  return setTimeout(function () {
    delete dict[key];
  }, 1000 * 60 * 30);
}

module.exports = user_controller;
//# sourceMappingURL=user.controller.js.map