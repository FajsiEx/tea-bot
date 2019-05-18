const CONFIG = require("../../../modules/config");
const dbInt = require("../../../db/interface");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            let mentionedUsers = msg.mentions.users;

            let type = msg.content.split(" ")[1];

            dbInt.getGuildDoc(msg.guild.id).then((doc) => {
                let restrictions = doc.restrictions;

                if (typeof(restrictions) != "object") {
                    restrictions = [];
                }

                mentionedUsers.forEach((mentionedUser)=>{
                    restrictions.push(mentionedUser.id);
                });

                if (type == "devMode") {
                    restrictions = "dev";
                }
                if (type == "adminMode") {
                    restrictions = "admin";
                }
                if (type == "clear") {
                    restrictions = false;
                }

                if (restrictions.length < 1) { // Empty array means no user was mentioned and there were no valid types of restriction in params to overwrite the empty array
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