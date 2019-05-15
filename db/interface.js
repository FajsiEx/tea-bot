/*

    Interface for getting and setting guild docs
    Works with cache and bridge

*/
const cache = require("./cache");
const dbBridge = require("./bridge");

module.exports = {
    getGuildDoc: function (guildId) {
        return new Promise((resolve) => {
            console.log(`[DB:INT:GET] WORKING Get guild doc [${guildId}]`.working);
            cache.getFromCache(guildId).then((cachedGuildDoc) => {
                if (cachedGuildDoc) {
                    console.log(`[DB:INT:GET] Done Get guild doc [${guildId}] - resolved with cache`.working);
                    resolve(cachedGuildDoc);
                }else{
                    dbBridge.getGuildDocument(guildId).then((guildDoc)=>{
                        console.log(`[DB:INT:GET] Done Get guild doc [${guildId}] - resolved with db`.working);
                        resolve(guildDoc);
                    });
                }
            });
        });
    },

    setGuildDoc: function (guildId, guildDoc) {
        return new Promise((resolve) => {
            dbBridge.writeGuildDocument(guildId, guildDoc).then(()=>{
                console.log(`[DB:INT:SET] DONE Set guild doc [${guildId}]`.success);
                resolve(true);
            });
        });
    }
};