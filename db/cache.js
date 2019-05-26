/*

    Caches guild documents that are requested form the db.

*/

let cachedGuildDocuments = {};
let cacheExpireTimestamps = {};
const CACHE_LIFESPAN = 1 * 60 * 1000; // 15 minutes

module.exports = {
    getFromCache: function (guildId) {
        return new Promise((resolve) => {
            if (cachedGuildDocuments[guildId] && cacheExpireTimestamps[guildId] > new Date().getTime()) {
                resolve(cachedGuildDocuments[guildId]);
            }else{
                resolve(false);
            }
        });
    },

    setCache: function (guildId, guildDoc) {
        return new Promise((resolve) => {
            cachedGuildDocuments[guildId] = guildDoc;
            cacheExpireTimestamps[guildId] = new Date().getTime() + CACHE_LIFESPAN;
            resolve(true);
        });
    }
};