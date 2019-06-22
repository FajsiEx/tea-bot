const CONFIG = require("../../../modules/config");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            let mentionedUsers = msg.mentions.users;

            if (mentionedUsers.size < 1) {
                msg.channel.send({
                    embed: {
                        "title": "Mute",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                            You must mention someone to be muted.
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).then(()=>{
                    return resolve(1);
                }).catch((e)=>{
                    return reject("Error sending 'no mentions' message: " + e);
                });
                return;
            }

            mentionedUsers.forEach((mentionedUser)=>{
                msg.guild.channels.forEach(channel => {
                    channel.overwritePermissions(mentionedUser, {
                        //SEND_MESSAGES: null, // For defaulting the perm
                        SEND_MESSAGES: false,
                    });
                });
            });

            msg.channel.send({
                embed: {
                    "title": "Mute",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
                    "description": `
                        User(s) were muted.
                    `,
                    "footer": CONFIG.EMBED.FOOTER(handleData)
                }
            }).then(()=>{
                return resolve(0);
            }).catch((e)=>{
                return reject("Error sending result message: " + e);
            });
        });
    }
};