/*

    Interface for getting and setting guild docs
    Works with cache and bridge

*/
const cache = require("./cache");
const dbBridge = require("./bridge");

module.exports = {
    getGuildDoc: function (guildId) {
        return new Promise((resolve, reject) => {
            cache.getFromCache(guildId).then((cachedGuildDoc) => {
                if (cachedGuildDoc) {
                    resolve(cachedGuildDoc);
                }else{
                    dbBridge.getGuildDocument(guildId).then((guildDoc)=>{
                        resolve(guildDoc);
                    }).catch((e)=>{return reject("Failed to get guildDoc from database: " + e);});
                }
            }).catch((e)=>{return reject("Failed to get guildDoc from cache: " + e);});
        });
    },

    setGuildDoc: function (guildId, guildDoc) {
        return new Promise((resolve) => {
            dbBridge.writeGuildDocument(guildId, guildDoc).then(()=>{
                resolve(true);
            });
        });
    }
};