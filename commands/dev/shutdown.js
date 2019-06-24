const CONFIG = require("../../modules/config");

module.exports = {
    handler: async function (messageEventData) {
        try {
            await messageEventData.msg.channel.send({
                "embed": {
                    "title": "Shutdown",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": `
                        Ok then. Here goes nothing.
                    `,
                    "footer": CONFIG.EMBED.FOOTER(messageEventData)
                }
            });
        } catch (e) {
            throw ("Failed to send response msg: " + e);
        }

        try {
            await messageEventData.dClient.destroy();
        } catch (e) {
            throw ("Failed to destroy dClient: " + e);
        }

        return 0;
    }
};