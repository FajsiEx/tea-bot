const CONFIG = require("../../modules/config");
const dbInt = require("../../db/interface");

module.exports = {
    generator: (generatorData)=>{
        return new Promise(async (resolve, reject)=>{
            let guildId = generatorData.guildId;

            try {
                let guildDoc = await dbInt.getGuildDoc(guildId);
            }catch(e){
                return reject("Could not get guild doc");
            }

            if (!guildId) {
                reject("False guildId");
            }
            
            resolve({
                "embed": {
                    "title": "Events",
                    "color": CONFIG.EMBED.COLORS.STICKY,
                    "description": `
                        
                    `,
                    "footer": CONFIG.EMBED.FOOTER()
                }
            });
        });
    }
};