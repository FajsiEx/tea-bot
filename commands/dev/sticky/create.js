const stickyController = require("../../../sticky/stickyController");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            stickyController.createStickyPost({
                guildId: msg.guild.id,
                type: "time",
                channel: msg.channel
            }).then(() => {
                console.log("[COMMAND:DEV:STICKYCREATE] Resolved");
                msg.delete(1000).catch((e)=>{console.log("Failed to delete the req msg.");}); // Delete the request msg. Catch any errors along the way
                return resolve(0);
            }).catch((e) => {
                console.log(`[COMMAND:DEV:STICKYCREATE] createStickyPost has rejected it's promise: ${e}`.error);
                return reject(`createStickyPost has rejected it's promise: ${e}`);
            });
        }); // End of promise
    } // End of handler
};