const CONFIG = require("../../modules/config");
const dbInt = require("../../db/interface");

module.exports = {
    generator: (generatorData)=>{
        return new Promise(async (resolve, reject)=>{
            let guildId = generatorData.guildId;

            let guildDoc;
            try {
                guildDoc = await dbInt.getGuildDoc(guildId);
            }catch(e){
                return reject("Could not get guild doc");
            }

            if (!guildId) {
                reject("False guildId");
            }

            let eventsArray = guildDoc.events;

            let resultEventString = "";
            eventsArray.forEach((event)=>{
                resultEventString += `**${event.date.getDate()}.${event.date.getMonth()}.${event.date.getFullYear()}** ${event.content} \n`;
            });
            
            resolve({
                "embed": {
                    "title": "Events",
                    "color": CONFIG.EMBED.COLORS.STICKY,
                    "description": `
                        ${resultEventString}
                        Last updated: ${new Date().toString()}
                    `,
                    "footer": CONFIG.EMBED.FOOTER()
                }
            });
        });
    }
};