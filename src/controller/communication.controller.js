import ioLib from 'socket.io';
import User from '../model/user.model';

let socket;
const web_video_Socket = (server) => {
    const io = ioLib(server);
    io.sockets.on('connection', function (socket_io) {
        socket = socket_io;
    });
};
const sendToReceiver = (req, res) => {
    User.findOne({username: req.query.friend_username}).then(result => {
        console.log(result._id);
        socket.emit(`vcall_${result._id}`, {caller: `${req.user.name}`});
        res.render('video');
    });
};
module.exports = {web_video_Socket, sendToReceiver};
