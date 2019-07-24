const CONFIG = require("../../../modules/config");
const permChecker = require("../../../modules/permChecker");
const outdent = require("outdent");

module.exports = {
    handler: async function (messageEventData) {
        let isAdmin;
        let isDev;

        try {
            isAdmin = await permChecker.admin(messageEventData.msg.member);
        }catch(e){
            throw("Failed to check admin perms: " + e);
        }

        try {
            isDev = await permChecker.dev(messageEventData.msg.author.id);
        }catch(e){
            throw("Failed to check dev perms: " + e);
        }


        try {
            await messageEventData.msg.channel.send({
                "embed": {
                    "title": "Permission module check",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": outdent`
                        Admin perms: **${isAdmin}**
                        Dev perms: **${isDev}**
                    `,
                    "footer": CONFIG.EMBED.FOOTER(messageEventData)
                }
            });
        } catch (e) {
            throw ("Failed to send response msg: " + e);
        }

        return 0;
    }
};