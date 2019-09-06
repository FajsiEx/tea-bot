/*
    Hello, L.A. BEAST HERE
    Now, all I'm going to do, is to try to code this bridge and service with so much sleep deprivation that i can literally drop to sleep any minute now.

    Have a good day :)
*/

const fbMessenger = require("facebook-chat-api");
const dbBridge = require("../../db/bridge");
const discordClient = require("../../discord/client").getDiscordClient();

module.exports.init = function () {
    fbMessenger({ email: process.env.T_FB_USER, password: process.env.T_FB_PASS, forceLogin: true }, (err, api) => {
        if (err) return console.log(err);

        api.listen((err, msg) => {
            console.log("[SERVICE: MESSENGER] Message event", msg);
            module.exports.messageEventHandler(msg);
        });
    });
};

module.exports.messageEventHandler = function (msg) {
    module.exports.bridgingHandler(msg);
};

module.exports.bridgingHandler = async function (msg) {
    if (msg.isGroup) {
        let bridgeDoc;
        try { bridgeDoc = await dbBridge.bridges.getDocFromSource("messenger", msg.threadID); }
        catch (e) { console.error("Could not get bridgeDoc: " + e); }

        if (bridgeDoc) {
            if (bridgeDoc.target.service == "discord") { // TODO: Integrate this with services when they're done.
                let channel;
                try {
                    channel = await discordClient.channels.get(bridgeDoc.target.target_id);
                } catch (e) {
                    console.error("Could not send bridge message: " + e);
                }

                try {
                    await channel.send(msg.body);
                } catch (e) {
                    console.log("Failed to send msg to target: " + e);
                }
            }
        }
    }
};