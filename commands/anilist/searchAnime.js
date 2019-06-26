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
            anime = await anilistApi.search(term, "anime");
        } catch (e) {
            throw ("Failed to search: " + e);
        }

        if (!anime) {
            try {
                await module.exports.responses.fail.noResults(messageEventData);
            }catch(e){
                throw("Failed sending noResults message: " + e);
            }
            return 2;
        }

        try {
            await module.exports.responses.success.searched(messageEventData, anime);
        }catch(e){
            throw("Failed sending response message: " + e);
        }

        return 0;
    },

    responses: {
        success: {
            searched: async function (messageEventData,anime) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": anime.title.english, // TODO: make this config via guild settings
                            "url": anime.siteUrl,
                            "color": CONFIG.EMBED.COLORS.INFO,
                            "description": outdent`
                                **${anime.episodes}** episodes
                                ${anime.description.replace(/<br\s*\/?>/mg,"")}

                                Avg score: **${anime.averageScore}**
                                Ep duration: **${anime.duration} minutes**
                                Genres: **${anime.genres.join(", ")}**
                                ${(anime.trailer.site == "youtube") ? "**[Trailer](https://youtube.com/watch?v="+anime.trailer.id+")**" : ""}
                            `,
                            "thumbnail": {
                                "url": anime.coverImage.medium
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