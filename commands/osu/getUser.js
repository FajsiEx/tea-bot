const CONFIG = require("../../modules/config");
const outdent = require("outdent");
const osu = require("node-osu");

const osuApi = new osu.Api(CONFIG.SECRETS.OSU.TOKEN, { notFoundAsError: false }); // TODO: make api module

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let commandLength = msg.content.split(" ")[0].length + 1;
        let term = msg.content.slice(commandLength);

        if (!term) {
            try {
                await module.exports.responses.fail.noResults(messageEventData);
            } catch (e) {
                throw ("Failed sending noResults message: " + e);
            }
            return 1;
        }

        let user;
        try {
            user = await osuApi.getUser({ u: term });
        } catch (e) {
            throw ("Failed to search: " + e);
        }

        if (user.length < 1) {
            try {
                await module.exports.responses.fail.noResults(messageEventData);
            } catch (e) {
                throw ("Failed sending noResults message: " + e);
            }
            return 2;
        }

        try {
            await module.exports.responses.success.searched(messageEventData, user);
        } catch (e) {
            throw ("Failed sending response message: " + e);
        }

        return 0;
    },

    responses: {
        success: {
            searched: async function (messageEventData, user) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": user.name,
                            "url": `https://osu.ppy.sh/users/${user.id}`,
                            "color": CONFIG.EMBED.COLORS.OSU,
                            "description": outdent`
                                PP: **${user.pp.raw}**
                                Rank: **#${user.pp.rank}** [${user.country}: #${user.pp.countryRank}]
                                Accuracy: **${user.accuracyFormatted}**
                                Level: **${user.level}**
                                Total score: **${user.scores.total}** [ranked: ${user.scores.ranked}]
                                Plays: **${user.counts.plays}**
                                SS+:**${user.counts.SSH} ** SS:**${user.counts.SS} ** S+:**${user.counts.SH} ** S:**${user.counts.S} ** A:**${user.counts.A} ** 
                            `,
                            "thumbnail": {
                                "url": `https://a.ppy.sh/${user.id}`
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
            noResults: async function (messageEventData) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "osu! | No user",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                No users under that name (or no name was provided)
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