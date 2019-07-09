const CONFIG = require("../../modules/config");
const outdent = require("outdent");
const settingsInterface = require("../../settings/settingsInterface");

module.exports = {
    handler: async function (messageEventData) {
        let settingName = messageEventData.msg.content.split(" ")[1];
        let settingValue = messageEventData.msg.content.split(" ")[2];

        if (!settingName) {
            try {
                await module.exports.responses.fail.noSettingName(messageEventData);
            }catch(e){
                throw("Failed to send msg: " + e);
            }
        }
        if (!settingValue) {
            try {
                await module.exports.responses.fail.noSettingName(messageEventData);
            }catch(e){
                throw("Failed to send msg: " + e);
            }
        }

        let responseCode;
        try {
            responseCode = await settingsInterface.set(messageEventData.msg.guild.id, settingName, settingValue);
        }catch(e){
            throw("Failed to set setting: " + e);
        }

        console.log(settingValue);
    },

    responses: {
        fail: {
            noSettingName: async function (messageEventData) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "Settings | Set",
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
            },
            noSettingValue: async function (messageEventData) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "Settings | Set",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": `
                                No setting value was given.
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