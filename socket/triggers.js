/* 

    External triggers
    Handles socket.io trigger events.

*/

const dbBridge = require("../db/bridge");
const dClient = require("../discord/client").getDiscordClient();

module.exports = {
    incomingData: async function (incomingData) {
        if(!module.exports.checkIncomingData(incomingData)) {
            console.log(`handleTrigger failed ${e}`.warn);
            throw("Invalid data");
        }

        let triggerDoc = await dbBridge.triggers.getDocFromToken(incomingData.token);

        console.log(triggerDoc);

        try {
            await module.exports.handleTrigger(incomingData, triggerDoc);
        }catch(e){
            throw("Could not handle the trigger: " + e);
        }

        return 0;
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
            return 10;
        }
    },

    checkIncomingData: function (data) {
        if (!data.token) { return false; }
        if (!data.type) { return false; }
        if (!data.body) { return false; }

        return true;
    }
};