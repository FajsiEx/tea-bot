const CONFIG = require("../../../modules/config");
const outdent = require("outdent");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let mentionedUsers = msg.mentions.users;

        if (mentionedUsers.size < 1) {
            try {
                msg.channel.send({
                    embed: {
                        "title": "Unmute",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": outdent`
                            You must mention someone to be unmuted.
                        `,
                        "footer": CONFIG.EMBED.FOOTER(messageEventData)
                    }
                });
            } catch (e) {
                throw ("Error sending 'no mentions' message: " + e);
            }

            return 1;
        }

        mentionedUsers.forEach((mentionedUser) => { // TODO: Promise.all (same as !mod:mute)
            msg.guild.channels.forEach(channel => {
                try {
                    channel.overwritePermissions(mentionedUser, {
                        SEND_MESSAGES: null, // For defaulting the perm
                    });
                } catch (e) {
                    console.log(`[COMMAND:MUTE] Unable to unmute user [${mentionedUser.tag}] from channel [${channel.id}] due to: ${e}`.warn);
                }
            });
        });

        try {
            await msg.channel.send({
                embed: {
                    "title": "Unmute",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
                    "description": outdent`
                        User(s) was unmuted.
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