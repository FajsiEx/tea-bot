const CONFIG = require("../../../modules/config");
const dbInt = require("../../../db/interface");

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
                    "title": "Int write of guild document",
                    "color": CONFIG.EMBED.COLORS.FAIL,
                    "description": `
                        Could not get guild id from the message.
                    `,
                    "footer": CONFIG.EMBED.FOOTER
                }
            });
            return false;
        }

        dbInt.getGuildDoc(guildId).then((doc)=>{
            console.log("[COMMAND:DEV:INTWRITE] DEBUG Got guild doc".debug);

            doc.testValue = `
            uraraka best girl. ${new Date().toString()}
            `; // Just some random test value
            
            if (!doc.testArray) {
                doc.testArray = [];
            }

            doc.testArray.push(new Date().toString());

            dbInt.setGuildDoc(guildId, doc).then(()=>{
                msg.channel.send({
                    "embed": {
                        "title": "Int write of guild document",
                        "color": CONFIG.EMBED.COLORS.SUCCESS,
                        "description": `
                            Done.
                            Guild ID: ${guildId}
                        `,
                        "footer": CONFIG.EMBED.FOOTER
                    }
                });
            }); // and write the doc
        });

        
    }
};