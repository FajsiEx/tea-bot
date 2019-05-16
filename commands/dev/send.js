/*

    Manual send command
    Sends a message to the chan specified by channel id

*/

const CONFIG = require("../../modules/config");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            let command = msg.content.split(" ")[0];
            let channelId = msg.content.split(" ")[1];
            let sendMsg = msg.content.slice(command.length + channelId.length + 2);

            handleData.dClient.channels.get(channelId).send(sendMsg).then(()=>{
                msg.channel.send({
                    "embed": {
                        "title": "Send",
                        "color": CONFIG.EMBED.COLORS.SUCCESS,
                        "description": `
                            The following message was sent to \`${channelId}\`
                            \`\`\`${sendMsg}\`\`\`
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).catch((e)=>{
                    return reject("Failed to send response: " + e);
                });
                return resolve(0);
            }).catch((e)=>{
                msg.channel.send({
                    "embed": {
                        "title": "Send",
                        "color": CONFIG.EMBED.COLORS.SUCCESS,
                        "description": `
                            Failed to send the message.
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).catch((e)=>{
                    return reject("Failed to send error response: " + e);
                });
                return reject("Failed to send message to the specified channel: " + e);
            });
        });
    }
};