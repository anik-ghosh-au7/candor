import ioLib from 'socket.io';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import dbInterface from './chat.db.interface';

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().utcOffset(330).format('h:mm=ss:S= a DD-MM-yy').toString()
    };
}

const botName = 'Candor Admin';

const authenticateToken = (token) => {
    let username;
    jwt.verify(token, process.env.jwt_key, (err, user) => {
        username = user.name;
    });
    return username;
};

const webSocket = (server) => {
    const io = ioLib(server);
    io.on('connection', socket => {
        let clientId = socket.handshake.headers['x-clientid'];
        let username = authenticateToken(clientId.split('=')[1]);
        let room = socket.handshake.headers['room'];
        console.log('new socket connection established', username);
        socket.on('joinRoom', async () => {
            await dbInterface.userJoin(username, room);
            socket.join(room);
            //Loads chat history
            // socket.emit('load_messages',await dbInterface.getChatHistory(room));

            let result = await dbInterface.getChatHistory(room);
            socket.emit('load_messages',result);

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
                users: await dbInterface.getRoomUsers(room)
            });
            console.log('AFTER roomUsers');
        });

        // Listen for chatMessage
        socket.on('chatMessage',async (msg) => {
            let full_msg = formatMessage(username, msg);
            await dbInterface.saveChatHistory(room, username, full_msg.text, full_msg.time);
            io.to(room).emit('message', formatMessage(username, msg));
        });

        // Runs when client disconnects
        socket.on('disconnect',async () => {
            const user = await dbInterface.userLeave(username, room);

            io.to(room).emit(
                'message',
                formatMessage(botName, `${username} has left the chat`)
            );

            // Send users and room info
            io.to(room).emit('roomUsers', {
                room: room,
                users: await dbInterface.getRoomUsers(room)
            });

        });
    });
};


module.exports = webSocket;
