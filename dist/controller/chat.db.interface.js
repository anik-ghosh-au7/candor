"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _chat = _interopRequireDefault(require("../model/chat.model"));

var _base = require("express-validator/src/base");

var dbInterface = {
  // Join user to chat
  userJoin: function () {
    var _userJoin = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(username, room) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log('ENTERED userJoin ');
              _context.next = 3;
              return _chat["default"].findOneAndUpdate({
                room_name: room
              }, {
                "$addToSet": {
                  "active_users": username
                }
              }, {
                upsert: true
              }).then(function (result) {
                console.log("EXECUTED ".concat(username, " joined room ").concat(room, " "));
              })["catch"](function (err) {
                return console.log(err);
              });

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function userJoin(_x, _x2) {
      return _userJoin.apply(this, arguments);
    }

    return userJoin;
  }(),
  //Load chat history
  // getChatHistory: async function (room) {
  //     return await Chat.findOne({room_name: room}, {chat_history: 1}).limit(5).then((res)=>{
  //         console.log(res,'->from db interface history');
  //         if(res){
  //             return res;
  //         }else{
  //             return []
  //         }
  //     });
  // },
  getChatHistory: function () {
    var _getChatHistory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(room) {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _chat["default"].aggregate([{
                $match: {
                  room_name: room
                }
              }, {
                $unwind: '$chat_history'
              }, {
                $group: {
                  "_id": null,
                  "chats": {
                    "$push": "$chat_history"
                  }
                }
              }, {
                $unwind: '$chats'
              }, {
                $sort: {
                  'chats.time': -1
                }
              }, {
                $limit: 5
              }, {
                $sort: {
                  'chats.time': 1
                }
              }]).then(function (res) {
                console.log("inside DB interface", res);
                return res;
              })["catch"](function (err) {
                return console.log(err);
              });

            case 2:
              return _context2.abrupt("return", _context2.sent);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function getChatHistory(_x3) {
      return _getChatHistory.apply(this, arguments);
    }

    return getChatHistory;
  }(),
  // Get room users
  getRoomUsers: function () {
    var _getRoomUsers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(room) {
      var room_users;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.log('ENTERED getroomusers');
              _context3.next = 3;
              return _chat["default"].findOne({
                room_name: room
              }).then(function (result) {
                console.log('EXECUTED', result.active_users);
                room_users = result.active_users;
                return result.active_users;
              })["catch"](function (err) {
                return console.log(err);
              });

            case 3:
              return _context3.abrupt("return", _context3.sent);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function getRoomUsers(_x4) {
      return _getRoomUsers.apply(this, arguments);
    }

    return getRoomUsers;
  }(),
  //Saves chat messages to the database
  saveChatHistory: function () {
    var _saveChatHistory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(room, username, text, time) {
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _chat["default"].findOneAndUpdate({
                room_name: room
              }, {
                "$push": {
                  "chat_history": {
                    username: username,
                    time: time,
                    text: text
                  }
                }
              }, {
                upsert: true
              }).then(function (result) {
                console.log("chat history saved");
              })["catch"](function (err) {
                return console.log(err);
              });

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function saveChatHistory(_x5, _x6, _x7, _x8) {
      return _saveChatHistory.apply(this, arguments);
    }

    return saveChatHistory;
  }(),
  // User leaves chat
  userLeave: function () {
    var _userLeave = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(username, room) {
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              console.log('ENTERED user leave');
              _context5.next = 3;
              return _chat["default"].findOneAndUpdate({
                room_name: room
              }, {
                "$pull": {
                  "active_users": username
                }
              }).then(function (result) {
                console.log("EXECUTED ".concat(username, " left room ").concat(room));
              })["catch"](function (err) {
                return console.log(err);
              });

            case 3:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    function userLeave(_x9, _x10) {
      return _userLeave.apply(this, arguments);
    }

    return userLeave;
  }()
};
module.exports = dbInterface;
//# sourceMappingURL=chat.db.interface.js.map