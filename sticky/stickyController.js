
const generators = require("./generatorData").generators;
const crypto = require("crypto");
const dbBridge = require("../db/bridge");

module.exports = {
    createStickyPost: function(creationData){
        return new Promise((resolve, reject)=>{
            let guildId = creationData.guildId;
            let type = creationData.type;
            let channel = creationData.channel;

            if (!guildId || !type || !channel) {
                reject("False guildId or false type or false channel");
            }

            let stickyMsgId;
            let hash;

            this.generateMessageData(creationData).then((messageData)=>{
                console.log(messageData);
                channel.send(messageData).then((stickyMsg)=>{
                    stickyMsgId = stickyMsg.id;
                    hash = this.hashMsgData(messageData);
                    console.log(hash);

                    dbBridge.createStickyMsgDocument({
                        hash: hash, // MD5 hash of json stringified message data. Used to compare if the data was changed on interval
                        g_id: guildId, // Guild id
                        c_id: channel.id, // Channel id
                        m_id: stickyMsgId, // Message id
                        expiry: new Date().getTime() + (1*60*1000), // Timestamp when the data needs to be regenerated. Used in the interval db query, TODO: Make this a const somewhere
                        type: type // Type for generator purposes 
                    });

                }).catch((e)=>{
                    reject("Failed to send a message: " + e);
                });

            }).catch((e)=>{
                reject("GenerateMessageData has rejected it's promise: " + e);
            });
        });
    },

    generateMessageData: function(messageCreationData) {
        return new Promise((resolve, reject)=>{
            let guildId = messageCreationData.guildId;
            let type = messageCreationData.type;

            if (!guildId || !type) {
                reject("False guildId or false type");
            }

            if (generators[type]) {
                generators[type].generator({
                    guildId: guildId
                }).then((messageData)=>{
                    console.log(messageData);
                    resolve(messageData);
                }).catch((e)=>{
                    reject(`Generator of type [${type}] has rejected it's promise: ${e}`);
                });
            }else{
                reject(`Did not find generator with type [${type}]. Please check if you imported it correctly in /sticky/generatorData`);
            }
        });
    },

    hashMsgData: function(messageData) {
        return crypto.createHash('md5').update(JSON.stringify(messageData)).digest("hex");
    },

    updateStickyDocs: function() {
        
    }
};