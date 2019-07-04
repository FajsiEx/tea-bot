/* 

    External triggers
    Handles socket.io trigger events.

*/

const dbBridge = require("../db/bridge");
const dClient = require("../discord/client").getDiscordClient();
const imageDownload = require("image-downloader");

module.exports = {
    incomingData: async function (incomingData) {
        if (!module.exports.checkIncomingData(incomingData)) {
            console.log(`handleTrigger failed ${e}`.warn);
            throw ("Invalid data");
        }

        let triggerDoc = await dbBridge.triggers.getDocFromToken(incomingData.token);

        try {
            await module.exports.handleTrigger(incomingData, triggerDoc);
        } catch (e) {
            throw ("Could not handle the trigger: " + e);
        }

        return 0;
    },

    handleTrigger: async function (incomingData, triggerDoc) {
        if (incomingData.type == "msg") {
            try {
                targetChannel = await dClient.channels.get(triggerDoc.c_id);
            } catch (e) {
                throw ("Could not get target channel: " + e);
            }

            try {
                if (incomingData.file) {
                    let fileName;
                    try {
                        let image = await imageDownload.image({
                            url: incomingData.file,
                            dest: "/"
                        });

                        fileName = image.filename;
                    }catch(e) {
                        throw("Failed to get image: " + e);
                    }
                    
                    await targetChannel.send(incomingData.body, {files: [fileName]});
                } else {
                    await targetChannel.send(incomingData.body);
                }
            } catch (e) {
                throw ("Could not send message to the target channel: " + e);
            }

            return 0;
        } else {
            throw ("Invalid trigger type");
        }
    },

    checkIncomingData: function (data) {
        if (!data.token) { return false; }
        if (!data.type) { return false; }
        if (!data.body) { return false; }

        return true;
    }
};