const CONFIG = require("../../modules/config");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            msg.channel.send({
                "embed": {
                    "title": "Shutdown",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": `
                        Ok then. Here goes nothing.
                    `,
                    "footer": CONFIG.EMBED.FOOTER(handleData)
                }
            }).catch((e)=>{
                return reject("Failed to send response msg: " + e);
            });

            handleData.dClient.destroy().then(()=>{
                return resolve(0);
            }).catch((e)=>{
                return reject("dClient.destroy method rejected it's promise: " + e);
            });
        });
    }
};