const chatMessages = document.querySelector('.msgs');
const chatForm = document.getElementById('chatForm');
const userList = document.getElementById('users');
let roomName = document.getElementById('roomName');

const url = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
const username = url.username;
const rooms = url.rooms;
const crooms = url.rooms;


//Socket io
const socket = io();

socket.emit('joinRoom', { username, rooms });

socket.on('roomUsers', ({ users, crooms }) => {
    outputRoomName(rooms);
    outputUsers(users);
});

// handling incoming messages
socket.on('message', (message) => {
    outputMessage(message);

    // scrolling to top
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// post message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//display message
const outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.msgs').appendChild(div);
}

const outputRoomName = (rooms) => {
    roomName.innerText = rooms;
}

const outputUsers = (users) => {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}
//leave room
document.getElementById('leave').addEventListener('click', () => {
    const leaveRoom = confirm('You will out from this room. Please confirm.');
    if (leaveRoom) {
        window.location = '../index.html';
    }
});
