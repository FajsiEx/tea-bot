const CONFIG = require("../modules/config");
const commandHandler = require("./command").handler;
const handleDataCheck = require("../checks/handleData").check;
const dbInt = require("../db/interface");

module.exports = {
    handler: function (handleData) {
        return new Promise((resolve, reject) => {
            if (handleDataCheck(handleData)) {
                console.log("[HANDLER:MSG] handleData check failed. Returning false.");
                reject("Failed handleData check");
            }

            if (handleData.msg.author.bot) {
                console.log("[HANDLER:MSG] Bot message ignored.".debug);
                resolve(2); // 2 = ignored bot message
            }

            let guildId = handleData.msg.guild.id;
            dbInt.getGuildDoc(guildId).then((doc) => {
                console.log("[COMMAND:DEV:INTWRITE] DEBUG Got guild doc".debug);

                if (typeof (doc.messageCount) != 'object') {
                    doc.messageCount = {};
                }

                if (typeof (doc.messageCount[handleData.msg.author.id]) != 'number') {
                    doc.messageCount[handleData.msg.author.id] = 0;
                }

                doc.messageCount[handleData.msg.author.id]++;

                console.log(`[HANDLER:MSG] Incrementing msgcount for [${guildId}:${handleData.msg.author.id}] to ${doc.messageCount[handleData.msg.author.id]}`.debug);

                dbInt.setGuildDoc(guildId, doc).then(() => { // After the doc is saved
                    let commandPrefix = module.exports.stringStartsWithPrefix(handleData.msg.content);
                    if (commandPrefix) {
                        console.log("[HANDLER:MSG] Passing off to COMMAND handler");
                        commandHandler(handleData, commandPrefix).then((status)=>{
                            resolve(1); // 1 = handled command
                        }).catch((e)=>{
                            reject("commandHandler rejected it's promise: " + e);
                        });
                    }
                });
            });
        });
    },

    stringStartsWithPrefix: function (stringToBeChecked) {
        let containsPrefix = CONFIG.DISCORD.PREFIXES.filter(prefix => {
            return stringToBeChecked.startsWith(prefix);
        })[0];

        return containsPrefix;
    }
};