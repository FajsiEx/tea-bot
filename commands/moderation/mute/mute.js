const CONFIG = require("../../../modules/config");
const outdent = require("outdent");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let mentionedUsers = msg.mentions.users;

        if (mentionedUsers.size < 1) {
            try {
                await msg.channel.send({
                    embed: {
                        "title": "Mute",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": outdent`
                            You must mention someone to be muted.
                        `,
                        "footer": CONFIG.EMBED.FOOTER(messageEventData)
                    }
                });
            } catch (e) {
                throw ("Error sending 'no mentions' message: " + e);
            }
            return 1;
        }

        mentionedUsers.forEach((mentionedUser) => { // TODO: Promise.all
            msg.guild.channels.forEach(channel => {
                channel.overwritePermissions(mentionedUser, {
                    //SEND_MESSAGES: null, // For defaulting the perm
                    SEND_MESSAGES: false,
                });
            });
        });

        try {
            await msg.channel.send({
                embed: {
                    "title": "Mute",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
                    "description": outdent`
                        User(s) were muted.
                    `,
                    "footer": CONFIG.EMBED.FOOTER(messageEventData)
                }
            });
        } catch (e) {
            throw ("Error sending result message: " + e);
        }

        return 0;
    }
};