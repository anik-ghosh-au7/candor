import ioLib from 'socket.io';
import jwt from 'jsonwebtoken';
import moment from 'moment';

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

const botName = 'Candor Admin';

const authenticateToken = (token) => {
    if (!token) {
        return res.redirect('/users/loginPage');
    }
    jwt.verify(token, process.env.jwt_key, (err, user) => {
        if (err) return res.status(403).send({msg: 'Unauthorized Forbidden'});
        console.log(user);
        return user.name;
    });
};

const webSocket = (server) => {
    const io = ioLib(server);

    // Run when client connects
    io.on('connection', socket => {
    let username = null;
    let room = null;

    console.log('new socket connection established');

    io.use((socket, next) => {
        let clientId = socket.handshake.headers['x-clientid'];
        console.log('from io');
        username = authenticateToken(clientId.split('=')[1]);
        room = socket.handshake.headers['room'];
      });

    socket.on('joinRoom', () => {
        // const user = userJoin(socket.id, username, room);

        let clientId = socket.handshake.headers['x-clientid'];
        console.log('from socket');
        username = authenticateToken(clientId.split('=')[1]);
        room = socket.handshake.headers['room'];

        console.log(room);

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
        // io.to(room).emit('roomUsers', {
        // room: room,
        // users: getRoomUsers(room)
        // });
    });

    // Listen for chatMessage
    // socket.on('chatMessage', msg => {
    //     const user = getCurrentUser(socket.id);

    //     io.to(room).emit('message', formatMessage(username, msg));
    // });

    // // Runs when client disconnects
    // socket.on('disconnect', () => {
    //     const user = userLeave(socket.id);

    //     if (user) {
    //     io.to(room).emit(
    //         'message',
    //         formatMessage(botName, `${username} has left the chat`)
    //     );

    //     // Send users and room info
    //     io.to(room).emit('roomUsers', {
    //         room: room,
    //         users: getRoomUsers(room)
    //     });
    //     }
    // });
    });
};

module.exports = webSocket;