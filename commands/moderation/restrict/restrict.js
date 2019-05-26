const CONFIG = require("../../../modules/config");
const dbInt = require("../../../db/interface");

const permChecker = require("../../../modules/permChecker");

module.exports = {
    handler: (handleData) => {
        return new Promise(async (resolve, reject) => {
            let msg = handleData.msg;

            let mentionedUsers = msg.mentions.users;

            let type = msg.content.split(" ")[1];

            dbInt.getGuildDoc(msg.guild.id).then(async (doc) => {
                let restrictions = doc.restrictions;

                if (!type) { // If the command does not have an argument (!mod:restrict)
                    await msg.channel.send({
                        embed: {
                            "title": "Restrict",
                            "color": CONFIG.EMBED.COLORS.INFO,
                            "description": `
                                Current restrictions: ${restrictions}
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    });
                    return resolve(0);
                }

                if (typeof (restrictions) != "object") {
                    restrictions = [];
                }

                let triedToRestrictDev = false; // True = won't show empty mentions error

                mentionedUsers.forEach(async (mentionedUser) => {
                    if (await permChecker.dev(mentionedUser.id)) {
                        console.log("Nope");
                        msg.channel.send({
                            embed: {
                                "title": "Baka!",
                                "color": CONFIG.EMBED.COLORS.FAIL,
                                "description": `
                                    You really thought you can restrict my master? Haha le funny joke!\n\`Do that one more time and I'll break your fucking knees.\`
                                `,
                                "footer": CONFIG.EMBED.FOOTER(handleData)
                            }
                        }).then((botMsg) => {
                            msg.delete(10000); // Delete the author's message
                            botMsg.delete(10000); // and also this message.
                        });

                        triedToRestrictDev = true;
                    } else {
                        restrictions.push(mentionedUser.id);
                    }
                });

                await Promise.all(restrictions);


                if (type == "dev") {
                    restrictions = "dev";
                }
                if (type == "admin") {
                    restrictions = "admin";
                }
                if (type == "clear") {
                    restrictions = false;
                }

                if (restrictions.length < 1) { // Empty array means no user was mentioned and there were no valid types of restriction in params to overwrite the empty array
                    if (triedToRestrictDev) {return resolve(1);}
                    msg.channel.send({
                        embed: {
                            "title": "Restrict command usage",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": `
                                You must mention someone to be restricted or restrict type.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    }).then(() => {
                        return resolve(1);
                    }).catch((e) => {
                        return reject("Error sending 'no mentions' message: " + e);
                    });
                    return;
                }

                doc.restrictions = restrictions;

                dbInt.setGuildDoc(msg.guild.id, doc).then(() => {
                    msg.channel.send({
                        embed: {
                            "title": "Restrict",
                            "color": CONFIG.EMBED.COLORS.SUCCESS,
                            "description": `
                                Done.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    }).then(() => {
                        return resolve(0);
                    }).catch((e) => {
                        return reject("Error sending result message: " + e);
                    });
                });
            });
        });
    }
};