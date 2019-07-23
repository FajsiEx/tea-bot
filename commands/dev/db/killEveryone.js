const CONFIG = require("../../../modules/config");
const dbBridge = require("../../../db/bridge");
const outdent = require("outdent");

module.exports = {
    handler: async function (messageEventData) {
        await dbBridge.maintenance.killEverything();

        await messageEventData.msg.channel.send({
            "embed": {
                "title": "KILLED EVERYONE",
                "color": CONFIG.EMBED.COLORS.SUCCESS,
                "description": outdent`
                    :)
                `,
                "footer": CONFIG.EMBED.FOOTER(messageEventData)
            }
        });
        return 0;
    }
};