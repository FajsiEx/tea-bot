const CONFIG = require("../../../modules/config");
const stickyController = require("../../../sticky/stickyController");

module.exports = {
    handler: (handleData)=>{
        let msg = handleData.msg;

        stickyController.createStickyPost({

        }).then(()=>{
            console.log("[COMMAND:DEV:STICKYCREATE] Resolved");
        }).catch((e)=>{
            console.log(`[COMMAND:DEV:STICKYCREATE] createStickyPost has rejected it's promise: ${e}`.error);
        });
        /* msg.channel.send({
            "embed": {
                "title": "Ping",
                "color": CONFIG.EMBED.COLORS.INFO,
                "description": `
                    Server message latency: ${new Date().getTime() - msg.createdTimestamp} ms
                `,
                "footer": CONFIG.EMBED.FOOTER(handleData)
            }
        }); */
    }
};