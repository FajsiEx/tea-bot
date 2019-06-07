const CONFIG = require("../../modules/config");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;
            msg.channel.send({
                "embed": {
                    "title": "Tea-bot | About",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": `
                        「 Tea-bot Re:Write Project 」
                        Build ${CONFIG.BOT.BUILD_INFO.BUILD_STRING}

                        Server message latency: ${new Date().getTime() - msg.createdTimestamp} ms
                        Server time: ${new Date().toString()}
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