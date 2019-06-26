/*

    Caches guild documents that are requested form the db.

*/

let cachedGuildDocuments = {};
let cacheExpireTimestamps = {};
const CACHE_LIFESPAN = 1 * 60 * 1000; // 15 minutes

module.exports = {
    getFromCache: async function (guildId) {
        if (cachedGuildDocuments[guildId] && cacheExpireTimestamps[guildId] > new Date().getTime()) {
            return cachedGuildDocuments[guildId];
        } else {
            return false;
        }
    },

    setCache: async function (guildId, guildDoc) {
        cachedGuildDocuments[guildId] = guildDoc;
        cacheExpireTimestamps[guildId] = new Date().getTime() + CACHE_LIFESPAN;
        return true;
    }
};