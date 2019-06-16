const CONFIG = require("../modules/config");
const outdent = require("outdent");

module.exports = {
    handler: async function handleData(handleData) {
        let msg = handleData.msg;
        try {
            await msg.channel.send({
                embed: {
                    title: "Ping",
                    color: CONFIG.EMBED.COLORS.INFO,
                    description: outdent`
                        Server message latency: ${new Date().getTime() - msg.createdTimestamp} ms
                    `,
                    footer: CONFIG.EMBED.FOOTER(handleData)
                }
            });
        } catch (e) {
            throw (`Failed to send response message: ${e}`);
        }

        return 0;
    }
};
