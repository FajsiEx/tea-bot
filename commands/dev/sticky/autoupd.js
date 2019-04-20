const CONFIG = require("../../../modules/config");
const stickyController = require("../../../sticky/stickyController");

module.exports = {
    handler: (handleData)=>{
        stickyController.updateStickyDocs().then(()=>{
            console.log("[COMMAND:DEV:STICKYAUTOUPD] Resolved");
        }).catch((e)=>{
            console.log(`[COMMAND:DEV:STICKYAUTOUPD] updateStickyDocs has rejected it's promise: ${e}`.error);
        });
    }
};