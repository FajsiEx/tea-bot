const CONFIG = require("../../../modules/config");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            let muteUser = msg.mentions.users.first();

            if (!muteUser) {
                msg.channel.send({
                    embed: {
                        "title": "Unmute",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                            You must mention someone to be unmuted.
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

            msg.guild.channels.forEach(channel => {
                try {
                    channel.permissionOverwrites.get(muteUser.id).delete();
                }catch(e){
                    console.log(`[COMMAND:MUTE] Unable to unmute user [${muteUser.tag}] from channel [${channel.id}] due to: ${e}`.warn);
                }
            });


            msg.channel.send({
                embed: {
                    "title": "Unmute",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
                    "description": `
                        User ${muteUser} was unmuted.
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
}