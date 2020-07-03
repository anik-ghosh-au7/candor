import ioLib from 'socket.io';
import jwt from 'jsonwebtoken';
import moment from 'moment';
const users = [];

// Join user to chat
function userJoin( username, room) {
  const user = { username, room };

  users.push(user);
}

// User leaves chat
function userLeave(username) {
  const index = users.findIndex(user => user.username === username);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

const botName = 'Candor Admin';

const authenticateToken = (token) => {
    let username;
    if (!token) {
        return res.redirect('/users/loginPage');
    }
    jwt.verify(token, process.env.jwt_key, (err, user) => {
        if (err) return res.status(403).send({msg: 'Unauthorized Forbidden'});
        console.log(user);
        username=user.name;
        // return user.name;
    });
    return username;
};

const webSocket = (server) => {
    const io = ioLib(server);
    // io.use((socket, next) => {
    //     let clientId = socket.handshake.headers['x-clientid'];
    //     console.log('from io');
    //     let username = authenticateToken(clientId.split('=')[1]);
    //     let room = socket.handshake.headers['room'];
    //     next()
    // });
    // Run when client connects
    io.on('connection', socket => {
        let clientId = socket.handshake.headers['x-clientid'];
        let username = authenticateToken(clientId.split('=')[1]);
        let room = socket.handshake.headers['room'];
        console.log('new socket connection established');
        socket.on('joinRoom', () => {
            userJoin(username, room);
            socket.join(room);
            // Welcome current user
            socket.emit('message', formatMessage(botName, 'Welcome to Candor!'));

            // Broadcast when a user connects
            socket.broadcast
                .to(room)
                .emit(
                    'message',
                    formatMessage(botName, `${username} has joined the chat`)
                );

            // Send users and room info
            io.to(room).emit('roomUsers', {
            room: room,
            users: getRoomUsers(room)
            });
        });

        // Listen for chatMessage
        socket.on('chatMessage', msg => {
            io.to(room).emit('message', formatMessage(username, msg));
        });

        // Runs when client disconnects
        socket.on('disconnect', () => {
            const user = userLeave(username);

            if (user) {
            io.to(room).emit(
                'message',
                formatMessage(botName, `${username} has left the chat`)
            );

            // Send users and room info
            io.to(room).emit('roomUsers', {
                room: room,
                users: getRoomUsers(room)
            });
            }
        });
    });
};

module.exports = webSocket;
