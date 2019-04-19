
const generators = require("./generatorData").generators;

module.exports = {
    createStickyPost: function(creationData){
        return new Promise((resolve, reject)=>{
            let guildId = creationData.guildId;
            let type = creationData.type;
            let channel = creationData.channel;

            if (!guildId || !type || !channel) {
                reject("False guildId or false type or false channel");
            }

            this.generateMessageData(creationData).then((messageData)=>{
                console.log(messageData);

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
    }
};