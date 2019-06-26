const CONFIG = require("/modules/config");
const outdent = require("outdent");
const anilistApi = require("./api");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let commandLength = msg.content.split(" ")[0].length + 1;
        let term = msg.content.slice(commandLength);

        let anime;
        try {
            anime = anilistApi.search(term);
        } catch (e) {
            throw ("Failed to search: " + e);
        }

        if (!anime) {
            this.responses.fail.noResults(msg);
            return 2;
        }

        this.responses.success.searched(msg, anime);

        return 0;
    },

    responses: {
        success: {
            searched: async function (msg,anime) {
                try {
                    await msg.channel.send({
                        "embed": {
                            "title": "(title)",
                            "color": CONFIG.EMBED.COLORS.SUCCESS,
                            "description": outdent`
                                ${JSON.stringify(anime)}
                            `,
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
            noResults: async function(msg) {
                try {
                    await msg.channel.send({
                        "embed": {
                            "title": "(title)",
                            "color": CONFIG.EMBED.COLORS.SUCCESS,
                            "description": outdent`
                                (desc)
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