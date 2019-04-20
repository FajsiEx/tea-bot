
const stickyController = require("../../../sticky/stickyController");

module.exports = {
    handler: (handleData)=>{
        stickyController.updateStickyDocs(handleData.dClient).then(()=>{
            console.log("[COMMAND:DEV:STICKYAUTOUPD] Resolved");
        }).catch((e)=>{
            console.log(`[COMMAND:DEV:STICKYAUTOUPD] updateStickyDocs has rejected it's promise: ${e}`.error);
        });
    }
};