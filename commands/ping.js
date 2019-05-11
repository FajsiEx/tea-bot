const CONFIG = require("../modules/config");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;
            msg.channel.send({
                "embed": {
                    "title": "Ping",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": `
                    Server message latency: ${new Date().getTime() - msg.createdTimestamp} ms
                `,
                    "footer": CONFIG.EMBED.FOOTER(handleData)
                }
            }).then(()=>{
                return resolve(0);
            }).catch((e)=>{
                return reject("Failed sending message: " + e);
            });
        });
    }
};