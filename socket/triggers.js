/* 

    External triggers
    Handles socket.io trigger events.

*/

module.exports = {
    incomingData: function(data) {
        console.log(data);
    }
};