const CONFIG = require("../../../modules/config");
const dbBridge = require("../../../db/bridge");

module.exports = {
    handler: async function (messageEventData) {
        await dbBridge.maintenance.killEverything();

        await messageEventData.msg.channel.send({
            "embed": {
                "title": "KILLED EVERYONE",
                "color": CONFIG.EMBED.COLORS.SUCCESS,
                "description": `
                    :)
                `,
                "footer": CONFIG.EMBED.FOOTER(messageEventData)
            }
        });
        return 0;
    }
};