const CONFIG = require("../modules/config");
const outdent = require("outdent");

module.exports = {
    handler: handleData => {
        dsd();
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;
            msg.channel.send({
                embed: {
                    title: "Ping",
                    color: CONFIG.EMBED.COLORS.INFO,
                    description: outdent`
                        Server message latency: ${new Date().getTime() - msg.createdTimestamp} ms
                    `,
                    footer: CONFIG.EMBED.FOOTER(handleData)
                }
            }).then(() => {
                return resolve(0);
            }).catch(e => {
                return reject("Failed sending message: " + e);
            });
        });
    }
};
