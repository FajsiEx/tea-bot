/* 

    External triggers
    Handles socket.io trigger events.

*/

const dbBridge = require("../db/bridge");
const dClient = require("../discord/client").getDiscordClient();

module.exports = {
    incomingData: async function (incomingData) {
        console.log(module.exports.checkIncomingData(incomingData));
        let triggerDoc = await dbBridge.triggers.getDocFromToken(incomingData.token);
        console.log(triggerDoc);

        module.exports.handleTrigger(incomingData, triggerDoc);
    },

    handleTrigger: async function (incomingData, triggerDoc) {
        if (incomingData.type == "msg") {
            try {
                targetChannel = await dClient.channels.get(triggerDoc.c_id);
            } catch (e) {
                console.log(`Could not get a channel: ${e}`.warn);
                throw("Could not get target channel: " + e);
            }

            try {
                await targetChannel.send(incomingData.body);
            }catch(e){
                throw("Could not send message to the target channel: " + e);
            }
            
            return 0;
        }else{
            console.log("wtf that type");
        }
    },

    checkIncomingData: function (data) {
        if (!data.token) { return false; }
        if (!data.type) { return false; }
        if (!data.body) { return false; }

        return true;
    }
};