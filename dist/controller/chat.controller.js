"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _socket = _interopRequireDefault(require("socket.io"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _moment = _interopRequireDefault(require("moment"));

var _chatDb = _interopRequireDefault(require("./chat.db.interface"));

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
      _chatDb["default"].userJoin(username, room);

      socket.join(room); // Welcome current user

      socket.emit('message', formatMessage(botName, 'Welcome to Candor!')); // Broadcast when a user connects

      socket.broadcast.to(room).emit('message', formatMessage(botName, "".concat(username, " has joined the chat"))); // Send users and room info

      io.to(room).emit('roomUsers', {
        room: room,
        users: _chatDb["default"].getRoomUsers(room)
      });
    }); // Listen for chatMessage

    socket.on('chatMessage', function (msg) {
      var full_msg = formatMessage(username, msg);

      _chatDb["default"].saveChatHistory(room, username, full_msg.text, full_msg.time);

      io.to(room).emit('message', formatMessage(username, msg));
    }); // Runs when client disconnects

    socket.on('disconnect', function () {
      var user = _chatDb["default"].userLeave(username, room);

      io.to(room).emit('message', formatMessage(botName, "".concat(username, " has left the chat"))); // Send users and room info

      io.to(room).emit('roomUsers', {
        room: room,
        users: _chatDb["default"].getRoomUsers(room)
      });
    });
  });
};

module.exports = webSocket;
//# sourceMappingURL=chat.controller.js.map