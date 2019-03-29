const CONFIG = require("../../../modules/config");
const dbBridge = require("../../../db/bridge");

module.exports = {
    handler: (handleData)=>{
        let msg = handleData.msg;

        let guildId = msg.guild.id;

        if (typeof(msg.content.split(" ")[1]) == 'number') {
            guildId = msg.content.split(" ")[1];
        }

        dbBridge.getGuildDocument(guildId).then((doc)=>{
            msg.channel.send({
                "embed": {
                    "title": "Get guild document",
                    "color": CONFIG.EMBED.COLORS.INFO,
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