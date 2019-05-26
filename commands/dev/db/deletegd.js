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

            let commandArg_guildId = parseInt(msg.content.split(" ")[1])
            if (commandArg_guildId) {
                guildId = commandArg_guildId;
            }

            if (!guildId) { // If the msg isn't in a guild (to get id from) and the user hasn't specified an id in the params, please fuck off
                msg.channel.send({
                    "embed": {
                        "title": "Delete guild document",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                            Could not get guild id from the message and no id was specified.
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).then(()=>{
                    return resolve(1);
                }).catch((e)=>{
                    return reject("Failed to send invalid parameter message: " + e);
                });
            }

            dbBridge.deleteGuildDocument(guildId).then(() => {
                msg.channel.send({
                    "embed": {
                        "title": "Delete guild document",
                        "color": CONFIG.EMBED.COLORS.SUCCESS,
                        "description": `
                            Deleted guild document.
                            Guild ID: ${guildId}
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).then(()=>{
                    return resolve(0);
                }).catch((e)=>{
                    return reject("Failed to send a success message: " + e);
                });
            }).catch((e)=>{
                return reject("Failed to deleteGuildDocument: " + e);
            });
        }); // End of promise
    } // End of handler
};