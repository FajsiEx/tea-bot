const CONFIG = require("../../../modules/config");
const dbInt = require("../../../db/interface");

const permChecker = require("../../../modules/permChecker");

const fetchMemberName = require("../../../discord/fetchMemberName");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let mentionedUsers = msg.mentions.users;

        let type = msg.content.split(" ")[1];

        let doc;

        try {
            doc = await dbInt.getGuildDoc(msg.guild.id);
        } catch (e) {
            throw ("Failed to get guild doc: " + e);
        }

        let restrictions = doc.restrictions;

        if (!type) { // If the command does not have an argument (only !mod:restrict)
            if (typeof (restrictions) == "object") {
                let usernameRestrictions = [];

                for (let userId of restrictions) {
                    try {
                        usernameRestrictions.push(await fetchMemberName(userId, msg.guild));
                    }catch(e){
                        console.log(e);
                        usernameRestrictions.push(userId);
                    }
                }

                restrictions = usernameRestrictions.join("\n");
            }


            try { // We will send listing of restrictions
                await msg.channel.send({
                    embed: {
                        "title": "Restrict",
                        "color": CONFIG.EMBED.COLORS.INFO,
                        "description": `
                            Current restrictions:
                            **${restrictions}**
                        `,
                        "footer": CONFIG.EMBED.FOOTER(messageEventData)
                    }
                });
            } catch (e) {
                throw ("Failed to send restrict listing msg: " + e);
            }
            return 0;
        }

        if (typeof (restrictions) != "object") {
            restrictions = []; // Set restrictions as an array to begin with
        }

        let triedToRestrictDev = false; // True = won't show empty mentions error

        mentionedUsers.forEach(async function (mentionedUser) {
            let isDev;
            try { isDev = await permChecker.dev(mentionedUser.id); }
            catch (e) { throw ("Failed to check dev perm:" + e); }

            if (isDev) {
                let botMsg;

                try {
                    botMsg = msg.channel.send({
                        embed: {
                            "title": "Baka!",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": `
                                You really thought you can restrict my master? wwwww\n\`Do that one more time and I'll break your fucking knees :)\`
                            `,
                            "footer": CONFIG.EMBED.FOOTER(messageEventData)
                        }
                    });
                } catch (e) {
                    throw ("Failed to send a fail message: " + e);
                }

                try {
                    msg.delete(10000); // Delete the author's message
                    botMsg.delete(10000); // and also this message.
                } catch (e) {
                    throw ("Failed to delete: " + e);
                }

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
            if (triedToRestrictDev) { return 1; } // If user tried to restrict dev, and did not mention any user other than dev

            try {
                await msg.channel.send({
                    embed: {
                        "title": "Restrict command usage",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                        You must mention someone to be restricted or enter a restrict type.
                    `,
                        "footer": CONFIG.EMBED.FOOTER(messageEventData)
                    }
                });
            } catch (e) {
                throw ("Error sending 'no mentions' message: " + e);
            }

            return 1;
        }

        doc.restrictions = restrictions;

        try {
            await dbInt.setGuildDoc(msg.guild.id, doc);
        } catch (e) {
            throw ("Error sending result message: " + e);
        }

        try {
            msg.channel.send({
                embed: {
                    "title": "Restrict",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
                    "description": `
                        Done.
                    `,
                    "footer": CONFIG.EMBED.FOOTER(messageEventData)
                }
            });
        } catch (e) {
            throw ("Failed to send success message: " + e);
        }
    }
};