const CONFIG = require("../../modules/config");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        try {
            let botMsg = await msg.channel.send({
                embed: {
                    "title": "Invalid command",
                    "color": CONFIG.EMBED.COLORS.FAIL,
                    "description": `
                        Look at the docs for valid command categories and their commands
                    `,
                    "footer": CONFIG.EMBED.FOOTER(messageEventData)
                }
            });
            botMsg.delete(15000);
        } catch (e) {
            throw("Failed to send invalid command message: " + e);
        }

        return 0;
    }
};