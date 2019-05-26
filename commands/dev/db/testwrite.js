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

            if (!guildId) { // If the msg isn't in a guild (to get id from) please fuck off
                msg.channel.send({
                    "embed": {
                        "title": "Write guild document",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                        Could not get guild id from the message.
                    `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).then(()=>{
                    return resolve(1);
                }).catch((e)=>{
                    return reject("Failed to send invalid parameter message: " + e);
                });
            }

            dbBridge.getGuildDocument(guildId).then((doc) => {
                doc.testValue = `
                    1273, down to Rockefeller Street
                    Life is marchin' on do you feel that
                `; // Just some random test value

                dbBridge.writeGuildDocument(guildId, doc).then(() => {
                    msg.channel.send({
                        "embed": {
                            "title": "Test write of guild document",
                            "color": CONFIG.EMBED.COLORS.SUCCESS,
                            "description": `
                                Done.
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
                    return  reject("Failed to writeGuildDocument: " + e);
                });
            }).catch((e)=>{
                return reject("Failed to getGuildDocument: " + e);
            });
        }); // End of promise
    } // End of handler
};