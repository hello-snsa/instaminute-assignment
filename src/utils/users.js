const users = [];

// adding user to chat room
const userJoin = (id, username, rooms) => {
    let user = { id, username, rooms };

    users.push(user);

    return user;
}

// getting current user details
const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
}

//removing user from chat room
const userLeft = (id) => {
    let index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// getting all users in room
const getRoomUsers = (rooms) => {
    return users.filter(user => user.rooms === rooms);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeft,
    getRoomUsers
};
