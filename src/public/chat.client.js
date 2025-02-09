const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// // Get username and room from URL
// const { username, room } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true
// });

let socket = io({
    transportOptions: {
        polling: {
            extraHeaders: {
                'x-clientid': document.cookie.split(' ')[0].replace(';', ''),
                'room': document.getElementById('room').innerText
            }
        }
    }
});
// Join chatroom
// socket.emit('joinRoom', { username, room });

socket.emit('joinRoom');

// Get room and users
socket.on('roomUsers', ({room, users}) => {
    console.log(users);
    outputRoomName(room);
    outputUsers(users);
});

socket.on('load_messages',message_arr=>{
    if(message_arr){
        message_arr.map((message)=>outputMessage(message.chats));
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

});

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    let time_arr = message.time.split('=');
    let time = time_arr[0] + time_arr[2];
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user}</li>`).join('')}
  `;
}

// close chat window
function close_window() {
    if (confirm("Close Forum Window?")) {
        close();
    }
}
