const generators = require("./generatorData").generators;
const crypto = require("crypto");
const dbBridge = require("../db/bridge");

module.exports = {
    createStickyPost: function (creationData) {
        return new Promise((resolve, reject) => {
            let guildId = creationData.guildId;
            let type = creationData.type;
            let channel = creationData.channel;

            if (!guildId || !type || !channel) {
                reject("False guildId or false type or false channel");
            }

            let stickyMsgId;
            let hash;

            this.generateMessageData(creationData).then((messageData) => {
                channel.send(messageData).then((stickyMsg) => {
                    stickyMsgId = stickyMsg.id;
                    hash = this.hashMsgData(messageData);

                    dbBridge.createStickyMsgDocument({
                        hash: hash, // MD5 hash of json stringified message data. Used to compare if the data was changed on interval
                        g_id: guildId, // Guild id
                        c_id: channel.id, // Channel id
                        m_id: stickyMsgId, // Message id
                        expiry: new Date().getTime() + (1 * 60 * 1000), // Timestamp when the data needs to be regenerated. Used in the interval db query, TODO: Make this a const somewhere
                        type: type // Type for generator purposes 
                    }).then(() => {
                        resolve();
                    }).catch((e) => {
                        reject("Failed to store data in db: " + e);
                    });

                }).catch((e) => {
                    reject("Failed to send a message: " + e);
                });

            }).catch((e) => {
                reject("GenerateMessageData has rejected it's promise: " + e);
            });
        });
    },

    generateMessageData: function (messageCreationData) {
        return new Promise((resolve, reject) => {
            let guildId = messageCreationData.guildId;
            let type = messageCreationData.type;

            if (!guildId || !type) {
                reject("False guildId or false type");
            }

            if (generators[type]) {
                generators[type].generator({
                    guildId: guildId
                }).then((messageData) => {
                    resolve(messageData);
                }).catch((e) => {
                    reject(`Generator of type [${type}] has rejected it's promise: ${e}`);
                });
            } else {
                reject(`Did not find generator with type [${type}]. Please check if you imported it correctly in /sticky/generatorData`);
            }
        });
    },

    hashMsgData: function (messageData) {
        return crypto.createHash('md5').update(JSON.stringify(messageData)).digest("hex");
    },

    updateStickyDocs: async function (dClient, guildId, forceUpdate) {
        let expiredDocs;

        try {
            expiredDocs = await dbBridge.getExpiredStickyDocs(guildId, forceUpdate);
        } catch (e) {
            throw ("Failed to getExpiredStickyDocs");
        }

        if (!expiredDocs) { // This WON'T trigger if expiredDocs is an empty array. It's just a safeguard...you never know ;)
            throw ("expiredDocs is false");
        }

        for (let doc of expiredDocs) {
            // TODO: Add external check for stickyDoc plz
            let messageData;
            try {
                messageData = await this.generateMessageData({
                    guildId: doc.g_id,
                    type: doc.type
                });
            } catch (e) {
                throw ("GenerateMessageData rejected: " + e);
            }

            let oldHash = doc.hash;
            let newHash = this.hashMsgData(messageData);

            if (oldHash == newHash) { // Data is the same
                try {
                    await dbBridge.updateStickyDoc(doc.m_id, {
                        expiry: new Date().getTime() + (1 * 60 * 1000)
                    });
                } catch (e) {
                    throw ("UpdateStickyDoc rejected: " + e);
                }
            } else {
                let channel = dClient.channels.get(doc.c_id);
                channel.startTyping();

                let msg;
                try {
                    msg = await channel.fetchMessage(doc.m_id);
                } catch (e) {
                    throw ("Failed to fetch message from a channel: " + e);
                }

                try {
                    await msg.edit(messageData);
                } catch (e) {
                    console.log(`[STICKYCTRL:UPDSTICKYDOCS] Promise rejection @ edit - deleting the sticky doc for [${doc.m_id}]: ${e}`.warn);
                    try {
                        dbBridge.deleteStickyDoc(doc.m_id);
                    } catch (e) {
                        console.log(`[STICKYCTRL:UPDSTICKYDOCS] Promise rejection @ deleteStickyDoc [${doc.m_id}]: ${e}`.warn);
                    }

                    channel.stopTyping();
                }

                try {
                    await dbBridge.updateStickyDoc(doc.m_id, {
                        expiry: new Date().getTime() + (1 * 60 * 1000),
                        hash: newHash
                    });
                } catch (e) {
                    console.log("[STICKYCTRL:UPDSTICKYDOCS] Failed to save updated data to db. e: " + e);
                    channel.stopTyping();
                }
                channel.stopTyping();
            }
        }

        console.log("Done////");
        return true;
    },

    deleteAllStickyMessagesFromChannel: function (c_id) {
        return new Promise((resolve, reject) => {
            dbBridge.deleteAllStickyDocsFromChannel(c_id).then(() => {
                resolve();
            }).catch((e) => {
                reject("Failed to delete data in db: " + e);
            });
        });
    }
};