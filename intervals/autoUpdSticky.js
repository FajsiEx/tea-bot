/*

    Auto updates sticky posts

*/

const stickyController = require("../sticky/stickyController");
const dbBridge = require("../db/bridge");

module.exports = {
    interval: async function (dClient) {
        if (!dbBridge.isDBReady()) {
            return false;
        }

        try {
            await stickyController.updateStickyDocs(dClient);
        } catch (e) {
            throw ("updateStickyDocs rejected: " + e);
        }
    },

    setup: function (dClient) {
        setInterval(async ()=>{
            try {
                await this.interval(dClient);
            }catch(e){
                console.log(`Failed to autoUpdSticky: ${e}`.error);
            }
        }, 5000); // TODO: move this to config along with lifespan of stickyDoc
    }
};