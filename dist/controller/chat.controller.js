"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _socket = _interopRequireDefault(require("socket.io"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _moment = _interopRequireDefault(require("moment"));

var _chat = _interopRequireDefault(require("../model/chat.model"));

// Join user to chat
function userJoin(username, room) {
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
} // User leaves chat


function userLeave(username, room) {
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
} // Get room users


function getRoomUsers(_x) {
  return _getRoomUsers.apply(this, arguments);
}

function _getRoomUsers() {
  _getRoomUsers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(room) {
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
  return _getRoomUsers.apply(this, arguments);
}

function formatMessage(username, text) {
  return {
    username: username,
    text: text,
    time: (0, _moment["default"])().format('h:mm a DD-MM-yy').toString()
  };
}

var botName = 'Candor Admin';

var authenticateToken = function authenticateToken(token) {
  var username;

  if (!token) {
    return res.redirect('/users/loginPage');
  }

  _jsonwebtoken["default"].verify(token, process.env.jwt_key, function (err, user) {
    if (err) return res.status(403).send({
      msg: 'Unauthorized Forbidden'
    });
    console.log(user);
    username = user.name; // return user.name;
  });

  return username;
};

var webSocket = function webSocket(server) {
  var io = (0, _socket["default"])(server);
  io.on('connection', function (socket) {
    var clientId = socket.handshake.headers['x-clientid'];
    var username = authenticateToken(clientId.split('=')[1]);
    var room = socket.handshake.headers['room'];
    console.log('new socket connection established');
    socket.on('joinRoom', function () {
      userJoin(username, room);
      socket.join(room); // Welcome current user

      socket.emit('message', formatMessage(botName, 'Welcome to Candor!')); // Broadcast when a user connects

      socket.broadcast.to(room).emit('message', formatMessage(botName, "".concat(username, " has joined the chat"))); // Send users and room info

      io.to(room).emit('roomUsers', {
        room: room,
        users: getRoomUsers(room)
      });
    }); // Listen for chatMessage

    socket.on('chatMessage', function (msg) {
      var full_msg = formatMessage(username, msg);
      saveChatHistory(room, username, full_msg.text, full_msg.time);
      io.to(room).emit('message', formatMessage(username, msg));
    }); // Runs when client disconnects

    socket.on('disconnect', function () {
      var user = userLeave(username, room);

      if (user) {
        io.to(room).emit('message', formatMessage(botName, "".concat(username, " has left the chat"))); // Send users and room info

        io.to(room).emit('roomUsers', {
          room: room,
          users: getRoomUsers(room)
        });
      }
    });
  });
};

function saveChatHistory(room, username, body, time) {
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
}

module.exports = webSocket;
//# sourceMappingURL=chat.controller.js.map