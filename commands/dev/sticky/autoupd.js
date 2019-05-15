const stickyController = require("../../../sticky/stickyController");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            stickyController.updateStickyDocs(handleData.dClient).then(() => {
                console.log("[COMMAND:DEV:STICKYAUTOUPD] Resolved");
                return resolve(0);
            }).catch((e) => {
                console.log(`[COMMAND:DEV:STICKYAUTOUPD] updateStickyDocs has rejected it's promise: ${e}`.error);
                return reject(`updateStickyDocs has rejected it's promise: ${e}`);
            });
        }); // End of promise
    } // End of handler
};