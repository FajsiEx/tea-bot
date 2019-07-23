const CONFIG = require("../../modules/config");
const outdent = require("outdent");

module.exports = {
    handler: async function (messageEventData) {
        try {
            await messageEventData.msg.channel.send({
                "embed": {
                    "title": "Shutdown",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
                    "description": outdent`
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
        
        console.log("Discord client destroyed!".critError);
        return 0;
    }
};