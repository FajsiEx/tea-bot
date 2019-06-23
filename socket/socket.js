
const socketIo = require("socket.io");
let io;

module.exports = {
    init: function(server) {
        io = socketIo(server);

        io.on('connection', function (socket) {
            console.log("Socket connected to something");
        });
    }
}