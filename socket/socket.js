
const socketIo = require("socket.io");
let io;

module.exports = {
    init: function(server) {
        io = socketIo(server);

        this.eventSetup(io);
    },

    eventSetup: function(io) {
        io.on('connection', function (socket) {
            console.log("Socket connected to something");
            socket.on('hookSend', function (data) {
                console.log(data);
            });
        });
    }
};