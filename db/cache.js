/*

    Caches guild documents that are requested form the db.

*/

let cachedGuildDocuments = {};
let cacheExpireTimestamps = {};
const CACHE_LIFESPAN = 1 * 60 * 1000; // 15 minutes

module.exports = {
    getFromCache: function (guildId) {
        return new Promise((resolve) => {
            console.log(`[DB:CACHE:GET] WORKING Getting guild doc from cache [${guildId}]`.working);
            if (cachedGuildDocuments[guildId] && cacheExpireTimestamps[guildId] > new Date().getTime()) {
                console.log(`[DB:CACHE:GET] DONE Got guild doc from cache [${guildId}]`.success);
                resolve(cachedGuildDocuments[guildId]);
            } else {
                console.log(`[DB:CACHE:GET] DONE Guild doc is not cached [${guildId}]`.success);
                resolve(false);
            }
        });
    },

    setCache: function (guildId, guildDoc) {
        return new Promise((resolve) => {
            console.log(`[DB:CACHE:SET] WORKING Setting guild doc to cache [${guildId}]`.working);
            cachedGuildDocuments[guildId] = guildDoc;
            cacheExpireTimestamps[guildId] = new Date().getTime() + CACHE_LIFESPAN;

            console.log(`[DB:CACHE:SET] DONE Set guild doc to cache [${guildId}]`.success);
            resolve(true);
        });
    }
};