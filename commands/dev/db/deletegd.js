const CONFIG = require("../../../modules/config");
const dbBridge = require("../../../db/bridge");

module.exports = {
    handler: (handleData)=>{
        let msg = handleData.msg;

        let guildId = false;

        if (msg.guild) {
            guildId = msg.guild.id;
        }

        console.log("[COMMAND:DEV:GGD] DEBUG ARG1: " + msg.content.split(" ")[1]);
        let commandArg_guildId = parseInt(msg.content.split(" ")[1])
        if (commandArg_guildId) {
            guildId = commandArg_guildId;
        }

        if (!guildId) { // If the msg isn't in a guild (to get id from) and trhe user hasn't specified an id in the params, please fuck off
            msg.channel.send({
                "embed": {
                    "title": "Delete guild document",
                    "color": CONFIG.EMBED.COLORS.FAIL,
                    "description": `
                        Could not get guild id from the message and no id was specified.
                    `,
                    "footer": CONFIG.EMBED.FOOTER
                }
            });
            return false;
        }

        dbBridge.deleteGuildDocument(guildId).then((doc)=>{
            msg.channel.send({
                "embed": {
                    "title": "Delete guild document",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
                    "description": `
                        Deleted guild document.
                        Guild ID: ${guildId}
                    `,
                    "footer": CONFIG.EMBED.FOOTER
                }
            });
        });

        
    }
};