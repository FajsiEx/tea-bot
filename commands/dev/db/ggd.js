const CONFIG = require("../../../modules/config");
const dbBridge = require("../../../db/bridge");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            let guildId = false;

            if (msg.guild) {
                guildId = msg.guild.id;
            }

            console.log("[COMMAND:DEV:GGD] DEBUG ARG1: " + msg.content.split(" ")[1]);
            let commandArg_guildId = parseInt(msg.content.split(" ")[1]);
            if (commandArg_guildId) {
                guildId = commandArg_guildId;
            }

            if (!guildId) { // If the msg isn't in a guild (to get id from) and true user hasn't specified an id in the params, please fuck off
                msg.channel.send({
                    "embed": {
                        "title": "Get guild document",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                        Could not get guild id from the message and no id was specified.
                    `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).then(()=>{
                    resolve(1);
                }).catch((e)=>{
                    reject("Failed to send a message: " + e);
                });
            }

            dbBridge.getGuildDocument(guildId).then((doc) => {
                msg.channel.send({
                    "embed": {
                        "title": "Get guild document",
                        "color": CONFIG.EMBED.COLORS.SUCCESS,
                        "description": `
                            Check logs for result.
                            Guild ID: ${guildId}
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).then(()=>{
                    resolve(0);
                }).catch((e)=>{
                    reject("Failed to send a success message: " + e);
                });

                console.log("--------------DEBUG OUTPUT--------------".debug);
                console.log("[COMMAND:DEV:GGD] DEBUG Result from GGD function:".debug);
                console.log(doc);
                console.log("------------DEBUG OUTPUT END------------".debug);
            }).catch((e)=>{
                reject("Failed to getGuildDocument: " + e);
            });
        }); // End of promise
    } // End of handler
};