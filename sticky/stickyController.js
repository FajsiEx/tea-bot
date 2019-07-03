const generators = require("./generatorData").generators;
const crypto = require("crypto");
const dbBridge = require("../db/bridge");

module.exports = {
    createStickyPost: async function (creationData) {
        let guildId = creationData.guildId;
        let type = creationData.type;
        let channel = creationData.channel;

        if (!guildId || !type || !channel) {
            throw ("False guildId or false type or false channel");
        }

        let stickyMsgId;
        let hash;

        let messageData;
        try {
            messageData = await this.generateMessageData(creationData);
        } catch (e) {
            throw ("GenerateMessageData has rejected it's promise: " + e);
        }

        let stickyMsg;
        try {
            stickyMsg = await channel.send(messageData);
        } catch (e) {
            throw ("Failed to send a message: " + e);
        }

        stickyMsgId = stickyMsg.id;
        hash = this.hashMsgData(messageData);

        try {
            await dbBridge.stickyDoc.create({
                hash: hash, // MD5 hash of json stringified message data. Used to compare if the data was changed on interval
                g_id: guildId, // Guild id
                c_id: channel.id, // Channel id
                m_id: stickyMsgId, // Message id
                expiry: new Date().getTime() + (1 * 60 * 1000), // Timestamp when the data needs to be regenerated. Used in the interval db query, TODO: Make this a const somewhere
                type: type // Type for generator purposes 
            });
        } catch (e) {
            throw ("Failed to store data in db: " + e);
        }
        return true;

    },

    generateMessageData: async function (messageCreationData) {
        let guildId = messageCreationData.guildId;
        let type = messageCreationData.type;

        if (!guildId || !type) {
            throw ("False guildId or false type");
        }

        if (!generators[type]) { // If a generator of this type is not found, throw an error
            throw (`Did not find generator with type [${type}]. Please check if you imported it correctly in /sticky/generatorData`);
        }

        let messageData;
        try {
            messageData = await generators[type].generator({
                guildId: guildId
            });
        } catch (e) {
            throw (`Generator of type [${type}] has rejected it's promise: ${e}`);
        }

        return messageData;
    },

    hashMsgData: function (messageData) {
        return crypto.createHash('md5').update(JSON.stringify(messageData)).digest("hex");
    },

    updateStickyDocs: async function (dClient, guildId, forceUpdate) {
        let expiredDocs;

        try {
            expiredDocs = await dbBridge.stickyDoc.getExpired(guildId, forceUpdate);
        } catch (e) {
            throw ("Failed to get expired sticky documents: " + e);
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
                    await dbBridge.stickyDoc.update(doc.m_id, {
                        expiry: new Date().getTime() + (1 * 60 * 1000)
                    });
                } catch (e) {
                    console.log(`[STICKYCTRL:UPDSTICKYDOCS] Promise rejection @ stickyDoc.update (expiry) for [${doc.m_id}] : ${e}`.warn);
                    continue;
                }
            } else {
                let channel = dClient.channels.get(doc.c_id);

                if (!channel) { // If the channel is out of reach of tea-bot
                    continue; // Rather that deleting sticky doc, just continue on to the next one.
                }

                // START OF TYPING
                channel.startTyping();

                let msg;
                try {
                    msg = await channel.fetchMessage(doc.m_id);
                } catch (e) {
                    console.log(`[STICKYCTRL:UPDSTICKYDOCS] Promise rejection @ fetchMessage - deleting sticky doc for [${doc.m_id}] : ${e}`.warn);
                    try {
                        await dbBridge.deleteStickyDoc(doc.m_id);
                    } catch (e) {
                        console.log(`[STICKYCTRL:UPDSTICKYDOCS] Promise rejection @ deleteStickyDoc [${doc.m_id}] : ${e}`.warn);
                    }

                    channel.stopTyping();
                    continue;
                }

                try {
                    await msg.edit(messageData);
                } catch (e) {
                    console.log(`[STICKYCTRL:UPDSTICKYDOCS] Promise rejection @ edit - deleting the sticky doc for [${doc.m_id}] : ${e}`.warn);
                    try {
                        await dbBridge.deleteStickyDoc(doc.m_id);
                    } catch (e) {
                        console.log(`[STICKYCTRL:UPDSTICKYDOCS] Promise rejection @ deleteStickyDoc [${doc.m_id}] : ${e}`.warn);
                    }

                    channel.stopTyping();
                    continue;
                }

                try {
                    await dbBridge.stickyDoc.update(doc.m_id, {
                        expiry: new Date().getTime() + (1 * 60 * 1000),
                        hash: newHash
                    });
                } catch (e) {
                    console.log("[STICKYCTRL:UPDSTICKYDOCS] Failed to save updated data to db. e: " + e);
                    channel.stopTyping();
                    continue;
                }
                channel.stopTyping();
            }
        }
        return true;
    },

    deleteAllStickyMessagesFromChannel: async function (c_id) {
        try {
            await dbBridge.deleteAllStickyDocsFromChannel(c_id);
        }catch(e){
            throw ("Failed to delete data in db: " + e);
        }
        return;
    }
};