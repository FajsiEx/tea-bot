const CONFIG = require("../../modules/config");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;
            if (!msg) {
                reject("Message is false");
            }
            msg.channel.send({
                "embed": {
                    "title": "Congrats :D",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": `
                        🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
                    `,
                    "footer": CONFIG.EMBED.FOOTER(handleData)
                }
            }).then(()=>{
                resolve(0);
            }).catch((e)=>{
                reject("Failed to send a message: " + e);
            });
        });
    }
};