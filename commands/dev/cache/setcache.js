const CONFIG = require("../../../modules/config");
const dbBridge = require("../../../db/bridge");
const cache = require("../../../db/cache");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            let guildId = false;

            if (msg.guild) {
                guildId = msg.guild.id;
            }

            let commandArg_guildId = parseInt(msg.content.split(" ")[1]);
            if (commandArg_guildId) {
                guildId = commandArg_guildId;
            }

            if (!guildId) { // If the msg isn't in a guild (to get id from) and the user hasn't specified an id in the params, please fuck off
                msg.channel.send({
                    "embed": {
                        "title": "Set guild doc cache",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                        Could not get guild id from the message and no id was specified.
                    `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).then(() => {
                    return resolve(1);
                }).catch((e) => {
                    return reject("Failed to send invalid parameter message: " + e);
                });
            }

            dbBridge.getGuildDocument(guildId).then((doc) => {
                cache.setCache(guildId, doc).then(() => {

                    msg.channel.send({
                        "embed": {
                            "title": "Set guild doc cache",
                            "color": CONFIG.EMBED.COLORS.SUCCESS,
                            "description": `
                            Done.
                            Guild ID: ${guildId}
                        `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    }).then(() => {
                        return resolve(0);
                    }).catch((e) => {
                        return reject("Failed to send success message: " + e);
                    });
                });
            });
        });
    }
};