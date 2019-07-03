/*

    Interface for getting and setting guild docs
    Works with cache and bridge

*/
const cache = require("./cache");
const dbBridge = require("./bridge");

module.exports = {
    getGuildDoc: async function (guildId) {
        let cachedGuildDoc;

        try {
            cachedGuildDoc = await cache.getFromCache(guildId);
        } catch (e) {
            throw ("Failed to get guildDoc from cache: " + e);
        }

        if (cachedGuildDoc) { //If the guild doc was found in cache, return that
            return cachedGuildDoc;
        } else { // Otherwise call db to get it and return that fetched guildDoc
            let guildDoc;
            try {
                guildDoc = await dbBridge.guildDoc.get(guildId);
            } catch (e) {
                throw ("Failed to get guildDoc from database: " + e);
            }

            return guildDoc;
        }
    },

    setGuildDoc: async function (guildId, guildDoc) {
        try {
            await dbBridge.guildDoc.update(guildId, guildDoc);
        }catch(e){
            throw("Failed to set guildDoc: " + e);
        }

        return true;
    }
};