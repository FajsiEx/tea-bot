const CONFIG = require("/modules/config");
const outdent = require("outdent");
const anilistApi = require("./api");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let commandLength = msg.content.split(" ")[0].length + 1;
        let username = msg.content.slice(commandLength);

        if (!username) {
            try {
                await module.exports.responses.fail.noResults(messageEventData);
            }catch(e){
                throw("Failed sending noResults message: " + e);
            }
            return 1;
        }

        let user;
        try {
            user = await anilistApi.getUser(username);
        } catch (e) {
            throw ("Failed to getUser: " + e);
        }

        if (!user) {
            try {
                await module.exports.responses.fail.noResults(messageEventData);
            }catch(e){
                throw("Failed sending noResults message: " + e);
            }
            return 2;
        }

        try {
            await module.exports.responses.success.searched(messageEventData, user);
        }catch(e){
            throw("Failed sending response message: " + e);
        }

        return 0;
    },

    responses: {
        success: {
            searched: async function (messageEventData,user) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": user.name,
                            "url": user.siteUrl,
                            "color": CONFIG.EMBED.COLORS.INFO,
                            "description": outdent`
                                
                            `,
                            "thumbnail": {
                                "url": user.avatar
                            },
                            "footer": CONFIG.EMBED.FOOTER(messageEventData)
                        }
                    });
                } catch (e) {
                    throw ("Failed sending message: " + e);
                }

                return;
            }
        },
        fail: {
            noResults: async function(messageEventData) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "No results",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                No results for that user (or no username was provided)
                            `,
                            "footer": CONFIG.EMBED.FOOTER(messageEventData)
                        }
                    });
                } catch (e) {
                    throw ("Failed sending message: " + e);
                }

                return;
            }
        }
    }
};