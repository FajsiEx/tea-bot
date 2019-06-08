/*

    Auto updates sticky posts

*/

const stickyController = require("../sticky/stickyController");

module.exports = {
    interval: async function (dClient) {
        console.log("autoUpdSticky");
        try {
            await stickyController.updateStickyDocs(dClient);
        } catch (e) {
            throw ("updateStickyDocs rejected: " + e);
        }
    },

    setup: function (dClient) {
        setInterval(()=>{
            this.interval(dClient);
        }, 5000); // TODO: move this to config along with lifespan of stickyDoc
    }
};