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
        if (parseInt(msg.content.split(" ")[1])) {
            guildId = msg.content.split(" ")[1];
        }

        if (!guildId) { // If the msg isn't in a guild (to get id from) and trhe user hasn't specified an id in the params, please fuck off
            msg.channel.send({
                "embed": {
                    "title": "Get guild document",
                    "color": CONFIG.EMBED.COLORS.FAIL,
                    "description": `
                        Could not get guild id from the message and no id was specified.
                    `,
                    "footer": CONFIG.EMBED.FOOTER
                }
            });
            return false;
        }

        dbBridge.getGuildDocument(guildId).then((doc)=>{
            msg.channel.send({
                "embed": {
                    "title": "Get guild document",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
                    "description": `
                        Check logs for result.
                    `,
                    "footer": CONFIG.EMBED.FOOTER
                }
            });
            
            console.log("--------------DEBUG OUTPUT--------------".debug);
            console.log("[COMMAND:DEV:GGD] DEBUG Result from GGD function:".debug);
            console.log(doc);
            console.log("------------DEBUG OUTPUT END------------".debug);
        });

        
    }
};