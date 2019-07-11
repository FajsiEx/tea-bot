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
        this.interval(dClient);
        setInterval(()=>{
            this.interval(dClient);
        }, 5000); // TODO: move this to config along with lifespan of stickyDoc
    }
};