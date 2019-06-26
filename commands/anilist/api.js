
const CONFIG = require("../../modules/config");
const Anilist = require('aniwrapper/node');
const aniClient = new Anilist(CONFIG.SECRETS.ANILIST.TOKEN);

module.exports = {
    search: async function(term) {
        let results;
        try {
            results = await aniClient.searchAnime(term);
        }catch(e){
            throw("Failed to search: " + e);
        }

        if (results.length < 1) {
            return false;
        }

        return results[0];
    }
}