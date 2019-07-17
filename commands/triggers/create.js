const CONFIG = require("/modules/config");
const outdent = require("outdent");

const dbBridge = require("../../db/bridge");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let token;
        try {
            token = await dbBridge.triggers.createDoc(msg.author.id, msg.channel.id, msg.id);
        }catch(e){
            throw("triggers.createDoc failed: " + e);
        }

        try {
            await msg.author.send({
                "embed": {
                    "title": "Trigger | Created",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": outdent`
                        Token has been generated for the \`${msg.channel.name}\` channel:
                        \`\`\`
                        ${token}
                        \`\`\`
                    `,
                    "footer": CONFIG.EMBED.FOOTER(messageEventData)
                }
            });
        } catch (e) {
            throw ("Failed sending message: " + e);
        }

        return 0;
    }
};