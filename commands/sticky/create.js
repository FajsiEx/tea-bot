const stickyController = require("/sticky/stickyController");
const generators = require("/sticky/generatorData").generators;
const CONFIG = require("/modules/config");

module.exports = {
    handler: async function (handleData) {
        let msg = handleData.msg;

        let type = msg.content.split(" ")[1];

        if (!generators[type]) {
            try {
                await module.exports.responses.error.invalidStickyType(handleData);
                return 1;
            } catch (e) {
                throw ("Failed to send invalid type message: " + e);
            }
        }

        try {
            await stickyController.createStickyPost({
                guildId: msg.guild.id,
                type: type,
                channel: msg.channel
            });
        } catch (e) {
            throw (`createStickyPost has rejected it's promise: ${e}`);
        }

        msg.delete(1000).catch(() => { }); // Delete the request msg. Catch any errors along the way
        return 0;
    },

    responses: {
        error: {
            invalidStickyType: async function (handleData) {
                let botMsg;
                try {
                    botMsg = await handleData.msg.channel.send({
                        "embed": {
                            "title": "Create sticky | Invalid type",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": `
                                Invalid or missing sticky type.
                                For valid sticky types, visit docs.

                                \`!sticky:create time\`
                                \`!sticky:create events\`
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    });
                } catch (e) {
                    throw ("Failed to send noTypeError response message: " + e);
                }

                try { botMsg.delete(10000); }
                catch (e) { console.log(`Could not delete message: ${e}`); }

                return true;
            },
        }
    }
};