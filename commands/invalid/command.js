const CONFIG = require("../../modules/config");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;
            msg.channel.send({
                embed: {
                    "title": "Invalid command",
                    "color": CONFIG.EMBED.COLORS.FAIL,
                    "description": `
                        Look at the docs for valid command categories and their commands
                    `,
                    "footer": CONFIG.EMBED.FOOTER(handleData)
                }
            }).then((botMsg) => {
                botMsg.delete(15000);
                resolve(0);
            }).catch((e) => {
                return reject("Failed to send invalid command message: " + e);
            });
        });
    }
};