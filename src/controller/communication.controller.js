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
        let sending_socket = false;
        let receiving_socket = false;
        let user_name;
        let user_img;
        // socket.on('setting_sending_socketID',async (data) => { //after allfriend.hbs(video.hbs) --> main.js
        //
        // });
        socket.on('call_to', async (data) => {
            sending_socket = true;
            let isFriend = false;
            await User.findByIdAndUpdate(data.id, {$set: {sending_socket_id: socket.id}},
                {upsert: true})
                .then(() => {
                    console.log(`sending ${socket.id} saved for ${data.id}`);
                    user_id = data.id;
                })
                .catch(err => console.log(err));

            console.log('surprise', user_id);
            await User.findById(user_id).then(result => {
                user_name = result.username;
                user_img = result.image_url;
                result.friend_list.forEach(name => {
                    if (name === data.friend_name) {
                        isFriend = true;
                    }
                })
            });
            if (isFriend) {
                await User.findOne({username: data.friend_name}).then(result => {
                    if (result.receiving_socket_id) {
                        console.log({'caller': user_name, 'receiver': data.friend_name})
                        socket.broadcast.to(result.receiving_socket_id).emit('new_incoming_vcall', {
                            caller: user_name,
                            caller_img: user_img
                        });
                    }
                })
            }

            // Check if data.friend_name is a friend in data base
            // Check if friend is having receiving socket ID in db
            //Emit event to friend with caller name and caller image
        });
        socket.on('ringing_started', (data) => {
            console.log(data)
            //Emit caller that ringing started
        });
        socket.on('setting_receiving_socketID', async (data) => { //background.js
            await User.findByIdAndUpdate(data, {$set: {receiving_socket_id: socket.id}},
                {upsert: true})
                .then(() => {
                    console.log(`receiving ${socket.id} saved for ${data}`);
                    user_id = data;
                })
                .catch(err => console.log(err));
            receiving_socket = true;
        });

        socket.on('call_user', (data) => {
            console.log('received data --> ', data);
        });

        socket.on('disconnect', async () => {
            console.log(socket.id, '-- >', user_id);
            if (sending_socket) {
                await User.findByIdAndUpdate(user_id, {$unset: {sending_socket_id: socket.id}})
                    .then(console.log(`sending socket_id removed for ${user_id}`))
                    .catch(err => console.log(err));
            } else if (receiving_socket) {
                await User.findByIdAndUpdate(user_id, {$unset: {receiving_socket_id: socket.id}})
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
