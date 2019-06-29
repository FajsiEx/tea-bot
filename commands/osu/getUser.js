const CONFIG = require("../../modules/config");
const outdent = require("outdent");
const osu = require("node-osu");

const osuApi = new osu.Api(CONFIG.SECRETS.OSU.TOKEN, {notFoundAsError: false});

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let commandLength = msg.content.split(" ")[0].length + 1;
        let term = msg.content.slice(commandLength);

        if (!term) {
            try {
                await module.exports.responses.fail.noResults(messageEventData);
            }catch(e){
                throw("Failed sending noResults message: " + e);
            }
            return 1;
        }

        let user;
        try {
            user = await osuApi.getUser({u: term});
        } catch (e) {
            throw ("Failed to search: " + e);
        }

        console.log(user);

        return 0;

        if (!user) {
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
                            "title": (anime.title.english) ? anime.title.english : anime.title.romaji, // TODO: make this config via guild settings
                            "url": anime.siteUrl,
                            "color": CONFIG.EMBED.COLORS.INFO, // TODO: Tidy up that thing down there
                            "description": outdent`
                                **${anime.episodes}** episodes
                                ${anime.description.replace(/<br\s*\/?>/mg,"")}

                                Avg score: **${anime.averageScore}**
                                Ep duration: **${anime.duration} minutes**
                                Genres: **${anime.genres.join(", ")}**
                                ${(anime.trailer) ? (anime.trailer.site == "youtube") ? "**[Trailer](https://youtube.com/watch?v="+anime.trailer.id+")**" : "" : ""}
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
                            "title": "No results",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                No results for that search term (or none was provided)
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