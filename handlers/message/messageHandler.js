const CONFIG = require("/modules/config");
const commandHandler = require("/handlers/command/commandHandler").handler;
const handleDataCheck = require("/checks/handleData").check;
const dbInt = require("/db/interface");
const permChecker = require("../../modules/permChecker");

module.exports = {
    handler: async function (handleData) {
        if (handleDataCheck(handleData)) {
            throw ("Failed handleData check");
        }

        if (handleData.msg.author.bot) {
            return 2; // 2 = ignored bot message
        }

        for (let user of handleData.msg.mentions.users.array()) { // Go through all message ping
            if (await permChecker.dev(user.id)) { // If any of the mentioned users is a dev
                handleData.msg.delete(); // Delete that message now ffs

                try {
                    handleData.msg.author.send("Your message was deleted, because he doesn't like pings. Feel free to send it again ***WITHOUT*** pinging him: `" + handleData.msg.content + "`");

                    if (handleData.msg.author.id == "342227744513327107" || handleData.msg.author.id ==  "194497230189756416") {
                        handleData.msg.author.send("If you don't stop, she'll come for you.");
                        handleData.msg.author.send({files: ["https://i.redd.it/lfr64ixd5ud31.png"]});
                    }else{
                        handleData.msg.author.send("Further pings may cause an angry bot.");
                    }
                }catch(e){
                    console.error("Failed to send ping auto delete msg: " + e);
                }
            }
        }

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
        }
    },

    stringStartsWithPrefix: function (stringToBeChecked) {
        let containsPrefix = CONFIG.DISCORD.PREFIXES.filter(prefix => {
            return stringToBeChecked.startsWith(prefix);
        })[0];

        return containsPrefix;
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