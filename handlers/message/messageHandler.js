const CONFIG = require("/modules/config");
const commandHandler = require("/handlers/command/commandHandler").handler;
const handleDataCheck = require("/checks/handleData").check;
const dbInt = require("/db/interface");
const dbBridge = require("/db/bridge");

let messApi;

module.exports = {
    handler: async function (handleData) {
        if (handleDataCheck(handleData)) {
            throw ("Failed handleData check");
        }

        if (handleData.msg.author.bot) {
            return 2; // 2 = ignored bot message
        }

        console.log(`[MSG] -${handleData.msg.channel.type}- ${handleData.msg.author.tag}: ${handleData.msg.content}`); // For testing. Will be removed later

        let commandPrefix = module.exports.stringStartsWithPrefix(handleData.msg.content);
        if (commandPrefix) {
            try { await commandHandler(handleData, commandPrefix); } // This will return a status
            catch (e) {
                throw ("commandHandler rejected it's promise: " + e);
            }

            try { await module.exports.incrementMessageCount(handleData); }
            catch (e) {
                throw ("Increment message count failed: " + e);
            }

            return 1; // 1 = handled command

        } else {
            module.exports.incrementMessageCount(handleData).then(() => {
                return 0; // 0 = handled msg without command
            }).catch((e) => {
                throw ("Increment message count failed: " + e);
            });

            let bridgeDoc;
            try { bridgeDoc = await dbBridge.bridges.getDocFromSource("discord", handleData.msg.channel.id); }
            catch (e) { console.error("Could not get bridgeDoc: " + e); }

            if (bridgeDoc) {
                if (!messApi) {
                    console.error("Mess API not ready yet!");
                }
            
                messApi.sendMessage({
                    body: handleData.msg.content
                }, bridgeDoc.target.target_id);
            }
        }
    },

    stringStartsWithPrefix: function (stringToBeChecked) {
        let containsPrefix = CONFIG.DISCORD.PREFIXES.filter(prefix => {
            return stringToBeChecked.startsWith(prefix);
        })[0];

        return containsPrefix;
    },

    setMessApi: function(_messApi) {
        messApi = _messApi;
    },

    incrementMessageCount: async function (handleData) {
        if (handleData.msg.channel.type != "text") {
            return 1; // Because DMs don't have the guild.id property we need to resolve here
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
                return 0;
            }).catch((e) => {
                throw ("Failed to setGuildDoc on increment: " + e);
            });
        }).catch((e) => {
            throw ("Failed to getGuildDoc on increment: " + e);
        });
    }
};