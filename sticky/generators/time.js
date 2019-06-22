const CONFIG = require("../../modules/config");

module.exports = {
    generator: async function (generatorData) {
        let guildId = generatorData.guildId;

        if (!guildId) {
            throw ("False guildId");
        }

        return {
            "embed": {
                "title": "Time sticky post",
                "color": CONFIG.EMBED.COLORS.STICKY,
                "description": `
                    Current server time: ${new Date().toString()}
                `,
                "footer": CONFIG.EMBED.FOOTER()
            }
        };
    }
};