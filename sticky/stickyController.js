
const generators = require("./generatorData").generators;
const crypto = require('crypto');

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
    }
};