const CONFIG = require("../../../modules/config");

module.exports = {
    handler: (handleData)=>{
        let msg = handleData.msg;

        console.log("[COMMAND:STICKY:CREATE] DEBUG test.");

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