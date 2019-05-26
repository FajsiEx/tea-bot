/*

    Interface for getting and setting guild docs
    Works with cache and bridge

*/
const cache = require("./cache");
const dbBridge = require("./bridge");

module.exports = {
    getGuildDoc: function (guildId) {
        return new Promise((resolve) => {
            cache.getFromCache(guildId).then((cachedGuildDoc) => {
                if (cachedGuildDoc) {
                    resolve(cachedGuildDoc);
                }else{
                    dbBridge.getGuildDocument(guildId).then((guildDoc)=>{
                        resolve(guildDoc);
                    });
                }
            });
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