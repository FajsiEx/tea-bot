const stickyController = require("../../../sticky/stickyController");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            stickyController.updateStickyDocs(handleData.dClient).then(() => {
                return resolve(0);
            }).catch((e) => {
                return reject(`updateStickyDocs has rejected it's promise: ${e}`);
            });
        }); // End of promise
    } // End of handler
};