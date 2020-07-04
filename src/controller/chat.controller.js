import ioLib from 'socket.io';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import Chat from '../model/chat.model';

const users = [];

// Join user to chat
function userJoin( username, room) {
  const user = { username, room };

  users.push(user);
//   console.log(username, room);
  userJoinDB(username, room);
}

// Join user to chat
function userJoinDB( username, room) {
    Chat.findOneAndUpdate({room_name: room}, 
                {
                    "$addToSet": {
                        "active_users": username
                    }
                }, { upsert : true })
                .then((result) => {
                    console.log(`${username} joined room ${room}`);
                })
                .catch(err => console.log(err));
  }

// User leaves chat
function userLeave(username, room) {
  const index = users.findIndex(user => user.username === username);
  userLeaveDB(username, room);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// User leaves chat
function userLeaveDB(username, room) {
    Chat.findOneAndUpdate({room_name: room}, 
        {
            "$pull": {
                "active_users": username
            }
        })
        .then((result) => {
            console.log(`${username} left room ${room}`);
        })
        .catch(err => console.log(err));
  }

// Get room users
function getRoomUsers(room) {
    getRoomUsersDB(room);
  return users.filter(user => user.room === room);
}

// Get room users
async function getRoomUsersDB(room) {
    let room_users;
    await Chat.find({room_name:room}).then(result => room_users = result[0].active_users).catch(err => console.log(err));
    console.log(room_users);
  }

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a DD-MM-YYYY').toString()
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
            let full_msg = formatMessage(username, msg);
            saveChatHistory(room, username, full_msg.text, full_msg.time);
            io.to(room).emit('message', formatMessage(username, msg));
        });

        // Runs when client disconnects
        socket.on('disconnect', () => {
            const user = userLeave(username, room);

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

function saveChatHistory(room, username, body, time) {
    Chat.findOneAndUpdate({room_name: room}, 
        {
            "$push": {
                "chat_history": {
                    username,
                    time,
                    body
                }
            }
        }, { upsert : true })
        .then(() => {
            console.log(`chat history saved`);
        })
        .catch(err => console.log(err));
}

module.exports = webSocket;
