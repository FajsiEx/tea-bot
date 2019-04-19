const CONFIG = require("../../modules/config");

module.exports = {
    generator: (generatorData)=>{
        return new Promise((resolve, reject)=>{
            let guildId = messageCreationData.guildId;

            if (!guildId) {
                reject("False guildId");
            }

            resolve({
                "embed": {
                    "title": "Time sticky post",
                    "color": CONFIG.EMBED.COLORS.STICKY,
                    "description": `
                        Current server time: ${new Date().toString()}
                    `,
                    "footer": CONFIG.EMBED.FOOTER(handleData)
                }
            });
        });
    }
};