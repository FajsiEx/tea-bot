/* 

    External triggers
    Handles socket.io trigger events.

*/

const dbBridge = require("../db/bridge");
const dClient = require("../discord/client").getDiscordClient();

const imageDownload = require("image-downloader");
const fs = require("fs");

const converter = require("video-converter");
const fdownload = require("file-downloadr");

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
                            dest: "./"
                        });

                        fileName = image.filename;

                        if (incomingData.convertMp4ToAudio) {
                            baseAudioFileName = "fdl_" + new Date().getTime() + incomingData.token.slice(-4);

                            try {
                                await new Promise((resolve, reject) => {
                                    converter.convert(fileName, `${baseAudioFileName}.mp3`, function (err) {
                                        if (err) reject(err);
                                        resolve();
                                    });
                                });
                            } catch (e) {
                                throw ("Failed to convert mp4 to mp3: " + e);
                            }

                            try {
                                await fs.unlink(fileName, () => { });
                            } catch (e) {
                                console.warn(e);
                            }
                            
                            fileName = baseAudioFileName + ".mp3";
                            
                        }
                    } catch (e) {
                        // Fallback if image download fails because it isn't an image or whatever reason
                        console.log("Falling back!!!!!!!!");
                        
                        fileName = incomingData.file;
                    }

                    console.log(fileName);

                    try {
                        await targetChannel.send(incomingData.body, { files: [fileName] });
                    } catch (e) {
                        throw ("Failed to send message to target channel: " + e);
                    }

                    try {
                        await fs.unlink(fileName, () => { });
                    } catch (e) {
                        console.warn(e);
                    }
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