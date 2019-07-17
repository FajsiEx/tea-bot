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
            throw ("Failed sending author message: " + e);
        }

        try {
            await msg.channel.send({
                "embed": {
                    "title": "Trigger | Created",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": outdent`
                        Token successfully generated!
                        Check your DM for the token.
                    `,
                    "footer": CONFIG.EMBED.FOOTER(messageEventData)
                }
            });
        } catch (e) {
            throw ("Failed sending channel message: " + e);
        }

        return 0;
    }
};