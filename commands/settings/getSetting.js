const CONFIG = require("../../modules/config");
const outdent = require("outdent");
const settingsInterface = require("../../settings/settingsInterface");

module.exports = {
    handler: async function (messageEventData) {
        let settingName = messageEventData.msg.content.split(" ")[1];

        if (!settingName) {
            // We want all settings

            let listOfSettings;
            try {
                listOfSettings = await settingsInterface.getSettingsList(messageEventData.msg.guild.id);
            }catch(e){
                throw("Could not get list of settings from settingsInterface: " + e);
            }

            try {
                await module.exports.responses.success.list(messageEventData, listOfSettings);
            }catch(e){
                throw("Failed to send msg: " + e);
            }

            return 0;
        }

        if (!settingsInterface.getSettingTemplate(settingName)) {
            try {
                await module.exports.responses.fail.invalidSetting(messageEventData, settingName);
                return 3;
            } catch (e) {
                throw ("Failed to send msg: " + e);
            }
        }

        let settingValue;
        try {
            settingValue = await settingsInterface.get(messageEventData.msg.guild.id, settingName);
        } catch (e) {
            throw ("Failed to get setting from the settingsInterface: " + e);
        }

        console.log(settingValue);
        
        try {
            await module.exports.responses.success.done(messageEventData, settingName, settingValue);
            return 0;
        } catch (e) {
            throw ("Failed to send msg: " + e);
        }
    },

    responses: {
        success: {
            done: async function (messageEventData, settingName, settingValue) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "Settings | Get",
                            "color": CONFIG.EMBED.COLORS.SUCCESS,
                            "description": outdent`
                                Setting \`${settingName}\` has value \`${settingValue}\`.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(messageEventData)
                        }
                    });
                    return 0;
                } catch (e) {
                    throw ("Failed to send a success message: " + e);
                }
            },

            list: async function (messageEventData, listOfSettings) {
                let responseString = "";

                for (let setting of listOfSettings) {
                    responseString+= `\`${setting.name}\`: \`${setting.value}\`\n`;
                }

                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "Settings | Get all settings",
                            "color": CONFIG.EMBED.COLORS.SUCCESS,
                            "description": responseString,
                            "footer": CONFIG.EMBED.FOOTER(messageEventData)
                        }
                    });
                    return 0;
                } catch (e) {
                    throw ("Failed to send a success message: " + e);
                }
            }
        },

        fail: {
            invalidSetting: async function (messageEventData, settingName) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "Settings | Get",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                Setting \`${settingName}\` does not exist.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(messageEventData)
                        }
                    });
                    return 0;
                } catch (e) {
                    throw ("Failed to send a fail message: " + e);
                }
            },
            noSettingName: async function (messageEventData) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "Settings | Get",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
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