const CONFIG = require("/modules/config");
const outdent = require("outdent");
const commandData = require("../../handlers/command/commandData");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;
        try {
            await msg.channel.send({
                "embed": {
                    "title": "Tea-bot | Commands",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": outdent`
                        ${commandData.getAllCommandsFormattedForMsg()}
                    `,
                    "footer": CONFIG.EMBED.FOOTER(messageEventData)
                }
            });
        } catch (e) {
            throw ("Failed sending message: " + e);
        }

        return 0;
    }
};