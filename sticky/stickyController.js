
const generators = require("./generatorData").generators;

module.exports = {
    createStickyPost: (creationData)=>{
        return new Promise((resolve, reject)=>{
            let guildId = creationData.guildId;
            let type = creationData.type;

            if (!guildId || !type) {
                reject("False guildId  or false type");
            }

            this.generateMessageData(creationData).then((messageData)=>{
                console.log(messageData);
            }).catch((e)=>{
                reject("GenerateMessageData rejected it's promise: " + e);
            });
        });
    },

    generateMessageData: (messageCreationData)=>{
        return new Promise((resolve, reject)=>{
            let guildId = messageCreationData.guildId;
            let type = messageCreationData.type;

            if (!guildId || !type) {
                reject("False guildId or false type");
            }

            if (generators[type]) {

            }else{
                reject(`Did not find generator with type [${type}]. Please check if you imported it correctly in /sticky/generatorData`);
            }
        });
    }
};