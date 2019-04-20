
const stickyController = require("../../../sticky/stickyController");

module.exports = {
    handler: (handleData)=>{
        let msg = handleData.msg;

        stickyController.createStickyPost({
            guildId: msg.guild.id,
            type: "time",
            channel: msg.channel
        }).then(()=>{
            console.log("[COMMAND:DEV:STICKYCREATE] Resolved");
        }).catch((e)=>{
            console.log(`[COMMAND:DEV:STICKYCREATE] createStickyPost has rejected it's promise: ${e}`.error);
        });
    }
};