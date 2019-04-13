/*

    Manual send command
    Sends a message to the chan specified by channel id

*/

const CONFIG = require("../../modules/config");

module.exports = {
    handler: (handleData)=>{
        let msg = handleData.msg;

        let command = msg.content.split(" ")[0];
        let channelId = msg.content.split(" ")[1];
        let sendMsg = msg.content.slice(command.length + channelId.length + 2);

        msg.channel.send({
            "embed": {
                "title": "Send",
                "color": CONFIG.EMBED.COLORS.SUCCESS,
                "description": `
                    The following message will be sent to \`${channelId}\`
                    \`\`\`${sendMsg}\`\`\`
                `,
                "footer": CONFIG.EMBED.FOOTER(handleData)
            }
        });

        handleData.dClient.channels.get(channelId).send(sendMsg);
    }
};