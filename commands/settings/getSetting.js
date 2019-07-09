const CONFIG = require("../../modules/config");
const outdent = require("outdent");
const settingsInterface = require("../../settings/settingsInterface");

module.exports = {
    handler: async function (messageEventData) {
        let settingName = messageEventData.msg.content.split(" ")[1];

        if (!settingName) {
            try {
                await module.exports.responses.fail.noSettingName(messageEventData.msg);
            }catch(e){
                throw("Failed to send msg: " + e);
            }
        }

        let settingValue;
        try {
            settingValue = await settingsInterface.get(messageEventData.msg.guild.id, settingName);
        }catch(e){
            throw("Failed to get setting from the settingsInterface: " + e);
        }

        console.log(settingValue);
    },

    responses: {
        fail: {
            noSettingName: async function (msg) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "Settings | Get",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": `
                                No setting name was given.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(messageEventData)
                        }
                    });
                    return 0;
                } catch (e) {
                    throw ("Failed to send a fail message: " + e);
                }
            }
        }
    }
};