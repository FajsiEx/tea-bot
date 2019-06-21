/*

    Manual send command
    Sends a message to the chan specified by channel id

*/

const CONFIG = require("../../modules/config");

module.exports = {
    handler: async function (handleData) {
        let msg = handleData.msg;

        let command = msg.content.split(" ")[0];
        let channelId = msg.content.split(" ")[1];
        let sendMsg = channelId ? msg.content.slice(command.length + channelId.length + 2) : false;

        if (!channelId || !sendMsg) {
            try {
                msg.channel.send({
                    "embed": {
                        "title": "Send | Invalid syntax",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                            That's an invalid syntax! Use:
                            \`!dev:send <chan_id> <msg>\`
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                });
            } catch (e) {
                throw ("Failed to send 'invalid syntax' message: " + e);
            }

            return 1;
        }

        let channel;
        try {
            channel = await handleData.dClient.channels.get(channelId);
        } catch (e) {
            console.log(`Could not get a channel: ${e}`.warn);

            try {
                await msg.channel.send({
                    "embed": {
                        "title": "Send",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                            Could not get the channel
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                });
            } catch (e) {
                throw ("Failed to send 'failed to send' message: " + e);
            }
            return 2;
        }

        try {
            channel.send(sendMsg);
        } catch (e) {
            try {
                console.log(`Could not send the message: ${e}`.warn);
                await msg.channel.send({
                    "embed": {
                        "title": "Send",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                            Failed to send the message.
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                });
            } catch (e) {
                throw ("Failed to send 'failed to send' message: " + e);
            }
            return 3;
        }

        // Message was sent

        try {
            await msg.channel.send({
                "embed": {
                    "title": "Send",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
                    "description": `
                        The following message was sent to \`${channelId}\`
                        \`\`\`${sendMsg}\`\`\`
                    `,
                    "footer": CONFIG.EMBED.FOOTER(handleData)
                }
            });
        } catch (e) {
            throw ("Failed to send success message: " + e);
        }

        return 0;
    }
};