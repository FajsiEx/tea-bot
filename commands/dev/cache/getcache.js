const CONFIG = require("../../../modules/config");
const cache = require("../../../db/cache");

module.exports = {
    handler: (handleData)=>{
        let msg = handleData.msg;

        let guildId = false;

        if (msg.guild) {
            guildId = msg.guild.id;
        }

        console.log("[COMMAND:DEV:GETCACHE] DEBUG ARG1: " + msg.content.split(" ")[1]);
        let commandArg_guildId = parseInt(msg.content.split(" ")[1]);
        if (commandArg_guildId) {
            guildId = commandArg_guildId;
        }

        if (!guildId) { // If the msg isn't in a guild (to get id from) and trhe user hasn't specified an id in the params, please fuck off
            msg.channel.send({
                "embed": {
                    "title": "Get guild doc cache",
                    "color": CONFIG.EMBED.COLORS.FAIL,
                    "description": `
                        Could not get guild id from the message and no id was specified.
                    `,
                    "footer": CONFIG.EMBED.FOOTER
                }
            });
            return false;
        }

        cache.getFromCache(guildId).then((doc)=>{
            console.log("[COMMAND:DEV:GETCACHE] DEBUG Got guild doc from cache".debug);

            msg.channel.send({
                "embed": {
                    "title": "Cache of guild document",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
                    "description": `
                        Done.
                        Guild ID: ${guildId}
                        Guild doc: ${JSON.stringify(doc)}
                    `,
                    "footer": CONFIG.EMBED.FOOTER
                }
            });
        });
    }
};