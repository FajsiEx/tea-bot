
const stickyController = require("../../../sticky/stickyController");

module.exports = {
    handler: (handleData)=>{
        let msg = handleData.msg;

        stickyController.deleteAllStickyMessagesFromChannel(msg.channel.id).then(()=>{
            console.log("[COMMAND:DEV:STICKYDELALL] Resolved");
        }).catch((e)=>{
            console.log(`[COMMAND:DEV:STICKYDELALL] deleteAllStickyMessagesFromChannel has rejected it's promise: ${e}`.error);
        });
    }
};