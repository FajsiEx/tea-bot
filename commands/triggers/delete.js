const CONFIG = require("/modules/config");
const outdent = require("outdent");

const dbBridge = require("../../db/bridge");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let token = msg.content.split(" ")[1];

        if (!token || token.indexOf("&") != 48) {
            try {
                await msg.channel.send({
                    "embed": {
                        "title": "Trigger | Delete",
                        "color": CONFIG.EMBED.COLORS.SUCCESS,
                        "description": outdent`
                            Not a valid or non-existing token.

                            Usage:
                            \`!triggers:delete <token>\`

                            Example:
                            \`!triggers:delete d8a7e31ca3c6e7e8c05dc95775a5b58f11df7c486f633faf&601152879243558928\`
                        `,
                        "footer": CONFIG.EMBED.FOOTER(messageEventData)
                    }
                });
            } catch (e) {
                throw ("Failed sending invalid token message: " + e);
            }
        }

        return;

        try {
            await dbBridge.triggers.createDoc(token);
        }catch(e){
            throw("triggers.createDoc failed: " + e);
        }

        try {
            await msg.channel.send({
                "embed": {
                    "title": "Trigger | Created",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
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