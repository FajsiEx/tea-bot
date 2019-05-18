const CONFIG = require("../../../modules/config");
const dbInt = require("../../../db/interface");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            let mentionedUsers = msg.mentions.users;

            let type = msg.content.split(" ")[1];

            if (mentionedUsers.size < 1 && !type) {
                msg.channel.send({
                    embed: {
                        "title": "Restrict command usage",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                            You must mention someone to be restricted or restrict type.
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

            dbInt.getGuildDoc(msg.guild.id).then((doc) => {
                let restrictions = doc.restrictions;

                if (typeof(restrictions) != "object") {
                    restrictions = [];
                }

                mentionedUsers.forEach((mentionedUser)=>{
                    restrictions.push(mentionedUser.id);
                });

                if (type == "admin") {
                    restrictions = "admin";
                }

                doc.restrictions = restrictions;

                dbInt.setGuildDoc(msg.guild.id, doc).then(() => {
                    msg.channel.send({
                        embed: {
                            "title": "Restrict command usage",
                            "color": CONFIG.EMBED.COLORS.SUCCESS,
                            "description": `
                                Done.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    }).then(()=>{
                        return resolve(0);
                    }).catch((e)=>{
                        return reject("Error sending result message: " + e);
                    });
                });
            });
        });
    }
};