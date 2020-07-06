"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _chat = _interopRequireDefault(require("../model/chat.model"));

var dbInterface = {
  // Join user to chat
  userJoin: function userJoin(username, room) {
    _chat["default"].findOneAndUpdate({
      room_name: room
    }, {
      "$addToSet": {
        "active_users": username
      }
    }, {
      upsert: true
    }).then(function (result) {
      console.log("".concat(username, " joined room ").concat(room));
    })["catch"](function (err) {
      return console.log(err);
    });
  },
  // Get room users
  getRoomUsers: function () {
    var _getRoomUsers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(room) {
      var room_users;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _chat["default"].findOne({
                room_name: room
              }).then(function (result) {
                return room_users = result.active_users;
              })["catch"](function (err) {
                return console.log(err);
              });

            case 2:
              return _context.abrupt("return", room_users);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function getRoomUsers(_x) {
      return _getRoomUsers.apply(this, arguments);
    }

    return getRoomUsers;
  }(),
  //Saves chat messages to the database
  saveChatHistory: function saveChatHistory(room, username, body, time) {
    _chat["default"].findOneAndUpdate({
      room_name: room
    }, {
      "$push": {
        "chat_history": {
          username: username,
          time: time,
          body: body
        }
      }
    }, {
      upsert: true
    }).then(function (result) {
      console.log("chat history saved");
    })["catch"](function (err) {
      return console.log(err);
    });
  },
  // User leaves chat
  userLeave: function userLeave(username, room) {
    _chat["default"].findOneAndUpdate({
      room_name: room
    }, {
      "$pull": {
        "active_users": username
      }
    }).then(function (result) {
      console.log("".concat(username, " left room ").concat(room));
    })["catch"](function (err) {
      return console.log(err);
    });
  }
};
module.exports = dbInterface;
//# sourceMappingURL=chat.db.interface.js.map