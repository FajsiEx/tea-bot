const stickyController = require("../../../sticky/stickyController");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            stickyController.deleteAllStickyMessagesFromChannel(msg.channel.id).then(() => {
                return resolve(0);
            }).catch((e) => {
                return reject(`deleteAllStickyMessagesFromChannel has rejected it's promise: ${e}`);
            });
        }); // End of promise
    } // End of handler
};