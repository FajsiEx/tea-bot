const CONFIG = require("../../../modules/config");
const dbBridge = require("../../../db/bridge");

module.exports = {
    handler: (handleData)=>{
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
            });
            return false;
        }

        dbBridge.getGuildDocument(guildId).then((doc)=>{
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
            });
        });
    }
};