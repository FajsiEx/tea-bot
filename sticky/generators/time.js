const CONFIG = require("../../modules/config");
const outdent = require("outdent");

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
                "description": outdent`
                    Current server time: ${new Date().toString()}
                `,
                "footer": CONFIG.EMBED.FOOTER()
            }
        };
    }
};