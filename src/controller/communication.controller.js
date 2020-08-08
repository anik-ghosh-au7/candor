import ioLib from 'socket.io';
import User from '../model/user.model';

// let socket;
const web_video_Socket = (server) => {
    const io = ioLib(server);
    io.sockets.on('connection', function (socket_io) {
        let socket = socket_io;
        // console.log('new socket --> ', socket.id);
        // socket.on('user_id', (data) => console.log('user id --> ', data));
        let user_id;
        let sending_socket=false;
        let receiving_socket=false;
        socket.on('user_id_for_sending', (data) => { //after allfriend.hbs(video.hbs) --> main.js
            User.findByIdAndUpdate(data, {$set: {sending_socket_id: socket.id}},
            {upsert: true})
            .then(() => {
                console.log(`sending ${socket.id} saved for ${data}`);
                user_id = data;
            })
            .catch(err => console.log(err));
            sending_socket=true;
        });

        socket.on('user_id_for_receiving', (data) => { //background.js
            User.findByIdAndUpdate(data, {$set: {receiving_socket_id: socket.id}},
            {upsert: true})
            .then(() => {
                console.log(`receiving ${socket.id} saved for ${data}`);
                user_id = data;
            })
            .catch(err => console.log(err));
            receiving_socket=true;
        });

        socket.on('call_user',(data) => {
            console.log('received data --> ',data);
        });

        socket.on('disconnect', () => {
            console.log(socket.id, '-- >', user_id);
            if (sending_socket) {
                User.findByIdAndUpdate(user_id, {$unset: {sending_socket_id: socket.id}})
                .then(console.log(`sending socket_id removed for ${user_id}`))
                .catch(err => console.log(err));
            } else if (receiving_socket) {
                User.findByIdAndUpdate(user_id, {$unset: {receiving_socket_id: socket.id}})
                .then(console.log(`receiving socket_id removed for ${user_id}`))
                .catch(err => console.log(err));
            } else {
                console.log('socket not found')
            }
        })
    });

};
const sendToReceiver = (req, res) => {
    // if (req.query.caller === 'true') {
    //     User.findOne({username: req.query.friend_username}).then(result => {
    //         console.log(result._id);
    //         socket.emit(`vcall_${result._id}`, {caller: `${req.user.name}`,caller_img: `${req.user.img}`});
    //         res.render('video', {caller: true});
    //     });
    // } else {
    //     // another function
    // }
};
module.exports = {web_video_Socket, sendToReceiver};
