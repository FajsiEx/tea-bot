const CONFIG = require("../../modules/config");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;
            if (!msg) {
                return reject("Message is false");
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
                return resolve(0);
            }).catch((e)=>{
                return reject("Failed to send a message: " + e);
            });
        });
    }
};