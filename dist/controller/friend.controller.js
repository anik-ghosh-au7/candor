"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _user = _interopRequireDefault(require("../model/user.model"));

var _message = _interopRequireDefault(require("../controller/message.controller"));

var friend_controller = {
  addFriend: function () {
    var _addFriend = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
      var flag;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              flag = true;

              if (!(req.user === req.body.friend_username)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", res.send("Can't send request to yourself"));

            case 3:
              ;

              if (!flag) {
                _context.next = 7;
                break;
              }

              _context.next = 7;
              return _user["default"].findOne({
                username: req.body.friend_username
              }).then(function (result) {
                if (!result) {
                  flag = false;
                  return res.send("Username doesn't exists");
                }

                ;
              })["catch"](function (err) {
                return console.error('1 --> ', err);
              });

            case 7:
              ;

              if (!flag) {
                _context.next = 11;
                break;
              }

              _context.next = 11;
              return _user["default"].findOne({
                username: req.user
              }).then(function (result) {
                for (var i = 0; i < result.friend_list.length; i++) {
                  if (result.friend_list[i] === req.body.friend_username) {
                    flag = false;
                    return res.send("{req.body.friend_username} is already added");
                  }

                  ;
                }

                ;
              })["catch"](function (err) {
                return console.log('2 --> ', err);
              });

            case 11:
              ;

              if (!flag) {
                _context.next = 15;
                break;
              }

              _context.next = 15;
              return _user["default"].findOne({
                username: req.user
              }).then(function (result) {
                for (var i = 0; i < result.received_requests.length; i++) {
                  if (result.received_requests[i] === req.body.friend_username) {
                    flag = false;
                    return res.send("".concat(req.body.friend_username, "'s request is pending"));
                  }

                  ;
                }

                ;
              })["catch"](function (err) {
                return console.log('2 --> ', err);
              });

            case 15:
              ;

              if (!flag) {
                _context.next = 19;
                break;
              }

              _context.next = 19;
              return _user["default"].findOne({
                username: req.body.friend_username
              }).then(function (search_result) {
                for (var i = 0; i < search_result.received_requests.length; i++) {
                  if (search_result.received_requests[i] === req.user) {
                    flag = false;
                    return res.send("Friend request is already sent");
                  }

                  ;
                }

                ;
              })["catch"](function (err) {
                return console.log('3 --> ', err);
              });

            case 19:
              ;

              if (flag) {
                _user["default"].findOneAndUpdate({
                  username: req.user
                }, {
                  $addToSet: {
                    sent_requests: req.body.friend_username
                  }
                })["catch"](function (err) {
                  return console.log('4 --> ', err);
                });

                _user["default"].findOneAndUpdate({
                  username: req.body.friend_username
                }, {
                  $addToSet: {
                    received_requests: req.user
                  }
                }).then(function () {
                  var title = "New friend request from ".concat(req.user);

                  _message["default"].handle_requests(req.body.friend_username, '', title, res);

                  return res.send("Friend request sent");
                })["catch"](function (err) {
                  return console.log('5 --> ', err);
                });
              }

              ;

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function addFriend(_x, _x2) {
      return _addFriend.apply(this, arguments);
    }

    return addFriend;
  }(),
  respondToRequest: function respondToRequest(req, res) {
    console.log(req.query);

    if (req.query.action === 'accept') {
      _user["default"].findOneAndUpdate({
        username: req.user
      }, {
        $addToSet: {
          friend_list: req.query.friend_username
        },
        $pull: {
          received_requests: req.query.friend_username
        }
      })["catch"](function (err) {
        return console.log(err);
      });

      _user["default"].findOneAndUpdate({
        username: req.query.friend_username
      }, {
        $addToSet: {
          friend_list: req.user
        },
        $pull: {
          sent_requests: req.user
        }
      })["catch"](function (err) {
        return console.log(err);
      });
    }

    ;

    if (req.query.action === 'reject') {
      _user["default"].findOneAndUpdate({
        username: req.user
      }, {
        $pull: {
          received_requests: req.query.friend_username
        }
      })["catch"](function (err) {
        return console.log(err);
      });

      _user["default"].findOneAndUpdate({
        username: req.query.friend_username
      }, {
        $pull: {
          sent_requests: req.user
        }
      })["catch"](function (err) {
        return console.log(err);
      });
    }

    ;

    if (req.query.action === 'unfriend') {
      _user["default"].findOneAndUpdate({
        username: req.user
      }, {
        $pull: {
          friend_list: req.query.friend_username
        }
      })["catch"](function (err) {
        return console.log(err);
      });

      _user["default"].findOneAndUpdate({
        username: req.query.friend_username
      }, {
        $pull: {
          friend_list: req.user
        }
      })["catch"](function (err) {
        return console.log(err);
      });
    }

    ;

    if (req.query.action === 'cancel') {
      _user["default"].findOneAndUpdate({
        username: req.user
      }, {
        $pull: {
          sent_requests: req.query.friend_username
        }
      })["catch"](function (err) {
        return console.log(err);
      });

      _user["default"].findOneAndUpdate({
        username: req.query.friend_username
      }, {
        $pull: {
          received_requests: req.user
        }
      })["catch"](function (err) {
        return console.log(err);
      });
    }

    res.send('redirect');
  },
  getAllFriends: function getAllFriends(req, res) {
    _user["default"].findOne({
      username: req.user
    }).then(function (result) {
      res.render('allFriends', {
        'friends': result.friend_list,
        'received': result.received_requests,
        'sent': result.sent_requests,
        'user': req.user
      });
    });
  }
};
module.exports = friend_controller;
//# sourceMappingURL=friend.controller.js.map