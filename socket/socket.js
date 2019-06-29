
const socketIo = require("socket.io");
let io;

const triggers = require("./triggers");

module.exports = {
    init: function(server) {
        io = socketIo(server);

        this.eventSetup(io);
    },

    eventSetup: function(io) {
        io.on('connection', function (socket) {
            socket.emit("connected");

            console.log("Socket connected to something");
            socket.on('triggerSend', async function(data) {
                try {
                    await triggers.incomingData(data);
                    socket.emit("done");
                }catch(e){
                    console.log(`triggers.incomingData rejected: ${e}`.warn);
                    socket.emit("error", {e:e});
                }
            });
        });
    }
};