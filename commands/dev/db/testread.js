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
                        "title": "Read guild document",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                            Could not get guild id from the message.
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).then(()=>{
                    resolve(1);
                }).catch((e)=>{
                    reject("Failed to send invalid parameter message: " + e);
                });
            }

            dbBridge.getGuildDocument(guildId).then((doc) => {
                console.log("[COMMAND:DEV:TESTWRITE] DEBUG Got guild doc".debug);

                msg.channel.send({
                    "embed": {
                        "title": "Test write of guild document",
                        "color": CONFIG.EMBED.COLORS.SUCCESS,
                        "description": `
                            Done.
                            Guild ID: ${guildId}
                            Guild doc: ${JSON.stringify(doc)}
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).then(()=>{
                    resolve(0);
                }).catch((e)=>{
                    reject("Failed to send a success message: " + e);
                });
            }).catch((e)=>{
                reject("Failed to getGuildDocument: " + e);
            });
        }); // End of promise
    } // End of handler
};