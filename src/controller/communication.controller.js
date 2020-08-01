import ioLib from 'socket.io';

const web_video_Socket = (server) => {
    console.log('inside --> controller - func');
    const io = ioLib(server);
    io.sockets.on('connection',function(socket){
        console.log('in controller .....');
        socket.emit('hello',{text:"node!"});
        socket.on('video', () => {
            console.log('video');
        });
    });
};

module.exports = web_video_Socket;