const CONFIG = require("../modules/config");
const commandHandler = require("./command").handler;
const handleDataCheck = require("../checks/handleData").check;
const dbInt = require("../db/interface");

module.exports = {
    handler: function (handleData) {
        return new Promise((resolve, reject) => {
            if (handleDataCheck(handleData)) {
                console.log("[HANDLER:MSG] handleData check failed. Returning false.");
                return reject("Failed handleData check");
            }

            if (handleData.msg.author.bot) {
                console.log("[HANDLER:MSG] Bot message ignored.".debug);
                return resolve(2); // 2 = ignored bot message
            }

            let commandPrefix = module.exports.stringStartsWithPrefix(handleData.msg.content);
            if (commandPrefix) {
                console.log("[HANDLER:MSG] Passing off to COMMAND handler");
                commandHandler(handleData, commandPrefix).then((status) => {
                    console.log("[HANDLER:MSG] Command handler returned status " + status);
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
            guildId = handleData.msg.guild.id;

            console.log("[COMMAND:DEV:MESSAGEINCREMENT] DEBUG Called".debug);

            dbInt.getGuildDoc(guildId).then((doc) => {
                console.log("[COMMAND:DEV:MESSAGEINCREMENT] DEBUG Got guild doc".debug);

                if (typeof (doc.messageCount) != 'object') {
                    doc.messageCount = {};
                }

                if (typeof (doc.messageCount[handleData.msg.author.id]) != 'number') {
                    doc.messageCount[handleData.msg.author.id] = 0;
                }

                doc.messageCount[handleData.msg.author.id]++;

                console.log(`[HANDLER:MSG] Incrementing message count for [${guildId}:${handleData.msg.author.id}] to ${doc.messageCount[handleData.msg.author.id]}`.debug);

                dbInt.setGuildDoc(guildId, doc).then(() => {
                    console.log("[COMMAND:DEV:MESSAGEINCREMENT] DEBUG Set guild doc. done.".debug);
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