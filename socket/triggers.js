/* 

    External triggers
    Handles socket.io trigger events.

*/

module.exports = {
    incomingData: function(data) {
        console.log(module.exports.checkIncomingData(data));
    },

    checkIncomingData: function(data) {
        if (!data.token) {return false;}
        if (!data.body) {return false;}

        return true;
    }
};