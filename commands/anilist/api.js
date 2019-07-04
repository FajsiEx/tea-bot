
const CONFIG = require("../../modules/config");
const anilist = require('anilist-node');
const anilistClient = new anilist(CONFIG.SECRETS.ANILIST.TOKEN);

module.exports = {
    search: async function (term, type) {
        let results;
        try {
            results = await anilistClient.search(type, term, 1, 5);
            results = results.media;
        } catch (e) {
            throw ("Failed to search: " + e);
        }


        if (results.length < 1) {
            return false;
        }

        let result; // TODO: add reject if nsfw is disabled in settings and result is nsfw
        if (type == "anime") {
            try {
                result = await anilistClient.media.anime(results[0].id);
            } catch (e) {
                throw ("Failed to fetch anime: " + e);
            }
        }

        return result;
    },

    getUser: async function (username) {
        let user = {};
        try {
            user.profile = await anilistClient.user.profile(username);
            user.stats = await anilistClient.user.stats(username);
        } catch (e) {
            throw ("Failed to get user: " + e);
        }

        if (user.profile.User === null || user.stats.User === null) { return false; }

        return user;
    }
};