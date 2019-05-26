const CONFIG = require("../modules/config");
const commandHandler = require("./command").handler;
const handleDataCheck = require("../checks/handleData").check;
const dbInt = require("../db/interface");

module.exports = {
    handler: function (handleData) {
        return new Promise((resolve, reject) => {
            if (handleDataCheck(handleData)) {
                return reject("Failed handleData check");
            }

            if (handleData.msg.author.bot) {
                return resolve(2); // 2 = ignored bot message
            }

            let commandPrefix = module.exports.stringStartsWithPrefix(handleData.msg.content);
            if (commandPrefix) {
                commandHandler(handleData, commandPrefix).then((status) => {
                    module.exports.incrementMessageCount(handleData).then(()=>{
                        return resolve(1); // 1 = handled command
                    }).catch((e)=>{
                        return reject("Increment message count failed: " + e);
                    });                    
                }).catch((e) => {
                    return reject("commandHandler rejected it's promise: " + e);
                });
            } else {
                module.exports.incrementMessageCount(handleData).then(()=>{
                    return resolve(0); // 0 = handled msg without command
                }).catch((e)=>{
                    return reject("Increment message count failed: " + e);
                });
            }
        });
    },

    stringStartsWithPrefix: function (stringToBeChecked) {
        let containsPrefix = CONFIG.DISCORD.PREFIXES.filter(prefix => {
            return stringToBeChecked.startsWith(prefix);
        })[0];

        return containsPrefix;
    },

    incrementMessageCount: function (handleData) {
        return new Promise((resolve, reject) => {
            if (handleData.msg.channel.type != "text") {
                resolve(1); // Because DMs don't have the guild.id property we need to resolve here
            }

            guildId = handleData.msg.guild.id;

            dbInt.getGuildDoc(guildId).then((doc) => {
                if (typeof (doc.messageCount) != 'object') {
                    doc.messageCount = {};
                }

                if (typeof (doc.messageCount[handleData.msg.author.id]) != 'number') {
                    doc.messageCount[handleData.msg.author.id] = 0;
                }

                doc.messageCount[handleData.msg.author.id]++;

                dbInt.setGuildDoc(guildId, doc).then(() => {
                    return resolve(0);
                }).catch((e)=>{
                    return reject("Failed to setGuildDoc on increment: " + e);
                });
            }).catch((e)=>{
                return reject("Failed to getGuildDoc on increment: " + e);
            });
        });
    }
};