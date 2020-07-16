"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _socket = _interopRequireDefault(require("socket.io"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _moment = _interopRequireDefault(require("moment"));

var _chatDb = _interopRequireDefault(require("./chat.db.interface"));

function formatMessage(username, text) {
  return {
    username: username,
    text: text,
    time: (0, _moment["default"])().format('h:mm=ss:S= a DD-MM-yy').toString()
  };
}

var botName = 'Candor Admin';

var authenticateToken = function authenticateToken(token) {
  var username;

  _jsonwebtoken["default"].verify(token, process.env.jwt_key, function (err, user) {
    username = user.name;
  });

  return username;
};

var webSocket = function webSocket(server) {
  var io = (0, _socket["default"])(server);
  io.on('connection', function (socket) {
    var clientId = socket.handshake.headers['x-clientid'];
    var username = authenticateToken(clientId.split('=')[1]);
    var room = socket.handshake.headers['room'];
    console.log('new socket connection established', username);
    socket.on('joinRoom', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var result;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _chatDb["default"].userJoin(username, room);

            case 2:
              socket.join(room); //Loads chat history
              // socket.emit('load_messages',await dbInterface.getChatHistory(room));

              _context.next = 5;
              return _chatDb["default"].getChatHistory(room);

            case 5:
              result = _context.sent;
              socket.emit('load_messages', result); // Welcome current user

              socket.emit('message', formatMessage(botName, 'Welcome to Candor!')); // Broadcast when a user connects

              socket.broadcast.to(room).emit('message', formatMessage(botName, "".concat(username, " has joined the chat"))); // Send users and room info

              _context.t0 = io.to(room);
              _context.t1 = room;
              _context.next = 13;
              return _chatDb["default"].getRoomUsers(room);

            case 13:
              _context.t2 = _context.sent;
              _context.t3 = {
                room: _context.t1,
                users: _context.t2
              };

              _context.t0.emit.call(_context.t0, 'roomUsers', _context.t3);

              console.log('AFTER roomUsers');

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))); // Listen for chatMessage

    socket.on('chatMessage', /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(msg) {
        var full_msg;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                full_msg = formatMessage(username, msg);
                _context2.next = 3;
                return _chatDb["default"].saveChatHistory(room, username, full_msg.text, full_msg.time);

              case 3:
                io.to(room).emit('message', formatMessage(username, msg));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }()); // Runs when client disconnects

    socket.on('disconnect', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var user;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _chatDb["default"].userLeave(username, room);

            case 2:
              user = _context3.sent;
              io.to(room).emit('message', formatMessage(botName, "".concat(username, " has left the chat"))); // Send users and room info

              _context3.t0 = io.to(room);
              _context3.t1 = room;
              _context3.next = 8;
              return _chatDb["default"].getRoomUsers(room);

            case 8:
              _context3.t2 = _context3.sent;
              _context3.t3 = {
                room: _context3.t1,
                users: _context3.t2
              };

              _context3.t0.emit.call(_context3.t0, 'roomUsers', _context3.t3);

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
  });
};

module.exports = webSocket;
//# sourceMappingURL=chat.controller.js.map