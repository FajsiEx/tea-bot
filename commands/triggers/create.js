const CONFIG = require("/modules/config");
const outdent = require("outdent");

const dbBridge = require("../../db/bridge");

module.exports = {
    handler: async function (messageEventData) {
        let token;
        try {
            token = await dbBridge.triggers.createDoc(messageEventData.msg.author.id, messageEventData.msg.channel.id, messageEventData.msg.id);
        }catch(e){
            throw("triggers.createDoc failed: " + e);
        }

        let msg = messageEventData.msg;
        try {
            await msg.author.send({
                "embed": {
                    "title": "Trigger | Created",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": outdent`
                        Token has been generated for the \`${messageEventData.msg.channel.name}\` channel:
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