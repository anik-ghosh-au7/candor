"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _socket = _interopRequireDefault(require("socket.io"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _moment = _interopRequireDefault(require("moment"));

var users = []; // Join user to chat

function userJoin(username, room) {
  var user = {
    username: username,
    room: room
  };
  users.push(user);
} // User leaves chat


function userLeave(username) {
  var index = users.findIndex(function (user) {
    return user.username === username;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
} // Get room users


function getRoomUsers(room) {
  return users.filter(function (user) {
    return user.room === room;
  });
}

function formatMessage(username, text) {
  return {
    username: username,
    text: text,
    time: (0, _moment["default"])().format('h:mm a')
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
  var io = (0, _socket["default"])(server); // io.use((socket, next) => {
  //     let clientId = socket.handshake.headers['x-clientid'];
  //     console.log('from io');
  //     let username = authenticateToken(clientId.split('=')[1]);
  //     let room = socket.handshake.headers['room'];
  //     next()
  // });
  // Run when client connects

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
      io.to(room).emit('message', formatMessage(username, msg));
    }); // Runs when client disconnects

    socket.on('disconnect', function () {
      var user = userLeave(username);

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

module.exports = webSocket;
//# sourceMappingURL=chat.controller.js.map