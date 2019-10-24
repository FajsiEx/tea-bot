/*
    Hello, L.A. BEAST HERE
    Now, all I'm going to do, is to try to code this bridge and service with so much sleep deprivation that i can literally drop to sleep any minute now.

    Have a good day :)
*/

const fbMessenger = require("facebook-chat-api");
const fetch = require('node-fetch');
const htmlParser = require('node-html-parser');
const imageDownload = require("image-downloader");
const fs = require("fs");
const converter = require("video-converter");
const decode = require("urldecode");

const dbBridge = require("../../db/bridge");
const discordClient = require("../../discord/client").getDiscordClient();

let messApi;

module.exports.init = function () {
    fbMessenger({ email: process.env.T_FB_USER, password: process.env.T_FB_PASS }, { forceLogin: true, selfListen: true }, async (err, api) => {
        if (err) {
            switch (err.error) {
                case 'login-approval':
                    console.log("Login approving. Waiting for 20 seconds. Please enter auth code via !dev:messauth <code>");
                    await new Promise((resolve, reject) => { setTimeout(resolve, 20 * 1000); });
                    let code = require("../../commands/dev/services/messAuth").getCode();
                    err.continue(code);
                    break;
                default:
                    console.error(err);
                    return;
            }
        }

        console.log(api);

        api.listen((err, msg) => {
            console.log("[SERVICE: MESSENGER] Message event", msg);
            module.exports.messageEventHandler(msg);
        });

        messApi = api;
    });
};

module.exports.messageEventHandler = function (msg) {
    module.exports.bridgingHandler(msg);
};

module.exports.sendMessage = async function(threadId, message) {
    if (!messApi) {
        console.error("Mess API not ready yet!");
    }

    messApi.sendMessage({
        body: message
    }, threadId);
};

module.exports.bridgingHandler = async function (msg) {
    if (msg.isGroup) {
        let bridgeDoc;
        try { bridgeDoc = await dbBridge.bridges.getDocFromSource("messenger", msg.threadID); }
        catch (e) { console.error("Could not get bridgeDoc: " + e); }

        if (bridgeDoc) {
            let username;
            try {
                const res = await fetch("https://graph.facebook.com/" + msg.senderID + "?fields=id,name&access_token=" + process.env.T_FB_ACCESSTOKEN);
                const profileData = await res.json();

                console.log(profileData);

                username = profileData.name;
            } catch (e) {
                console.error("Failed to fetch userpage for fb profile: " + e);
            }

            console.log(username);

            if (bridgeDoc.target.service == "discord") { // TODO: Integrate this with services when they're done.
                let channel;
                try {
                    channel = await discordClient.channels.get(bridgeDoc.target.target_id);
                } catch (e) {
                    console.error("Could not send bridge message: " + e);
                }

                let files = [];
                if (msg.attachments.length > 0) {
                    for (const attachment of msg.attachments) {
                        const attachUrl = decode(attachment.url); // Decode anything encoded in the url

                        const file = await imageDownload.image({
                            url: attachUrl,
                            dest: "./"
                        });

                        let fileName = file.filename;

                        if (attachment.audioType == "VOICE_MESSAGE") {
                            baseAudioFileName = "fdl_" + new Date().getTime() + msg.messageID.slice(-4);

                            try {
                                await new Promise((resolve, reject) => {
                                    converter.convert(fileName, `${baseAudioFileName}.mp3`, function (err) {
                                        if (err) reject(err);
                                        resolve();
                                    });
                                });
                            } catch (e) {
                                console.error("Failed to convert mp4 to mp3: " + e);
                            }

                            try {
                                await fs.unlink(fileName, () => { });
                            } catch (e) {
                                console.warn(e);
                            }

                            fileName = baseAudioFileName + ".mp3";
                        }

                        files.push(fileName);
                    }
                }

                try {
                    const msgDate = new Date(parseInt(msg.timestamp));

                    const msgHours = (msgDate.getHours() >= 10) ? msgDate.getHours() : "0" + msgDate.getHours();
                    const msgMinutes = (msgDate.getMinutes() >= 10) ? msgDate.getMinutes() : "0" + msgDate.getMinutes();

                    await channel.send(
                        `${msgHours}:${msgMinutes} **${username}**: ${msg.body}`,
                        { files }
                    );

                    if (files.length > 0) {
                        for (const fileName of files) {
                            fs.unlink("./" + fileName.name, () => { });
                        }
                    }
                } catch (e) {
                    console.log("Failed to send msg to target: " + e);
                }
            }
        }
    }
};