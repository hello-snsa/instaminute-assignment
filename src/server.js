const express = require('express');
const http = require('http');
const path = require('path');

const socketio = require('socket.io');

const formatMessage = require('./utils/messages');

const { userJoin, getCurrentUser, userLeft, getRoomUsers } = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, '../')));

const botName = 'chatBot';

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessage(botName, 'Welcome to instaminutes chatroom '));
        //user Joined
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            );
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    //user left
    socket.on('disconnect', () => {
        const user = userLeft(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username}  left the room`)
            );


            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const start = async () => {
    const PORT = process.env.PORT || 3000;

    try {
        server.listen(PORT, () => {

            console.log("Listening at port ", PORT);
        })

    }
    catch (e) {
        console.log('Server disconnected!  Error: ', e);
    }

}

module.exports = start;