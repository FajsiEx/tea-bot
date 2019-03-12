
const globalVariables = require("../../../globalVariables");
const CONSTS = require("../../../consts");

module.exports = {
    command: function(msg, discordClient) {
        let dp = globalVariables.get("dp");
        console.dir(dp);

        if (!dp) { // If the object is empty
            msg.channel.send({
                "embed": {
                    "title": "No DP",
                    "description": `
                        You must make DP like so:
                        *!makedp detailsdetailsdetailsdetails*
                    `,
                    "color": CONSTS.COLORS.RED
                }
            }).then((botMsg)=>{
                botMsg.delete(60000);
            });
            msg.delete(1000);
            return;
        }

        let guilds = discordClient.guilds.array();
        console.log("[STAT_DP] Bot in " + guilds.length + " guilds.");

        let homeGuild = guilds[0];
        if (!homeGuild) {
            console.log("[STAT_DP] No guild. Abort.".warn);
            msg.channel.send({
                "embed": {
                    "title": "No guild",
                    "description": `
                        Bot isn't in any guild.
                    `,
                    "color": CONSTS.COLORS.RED
                }
            });
            return;
        }

        let dpGuild = homeGuild;

        let members = dpGuild.members.array();

        let comingNicks = [];

        Object.keys(dp.joined).forEach((userId) => {

            let user = dp.joined[userId];

            // Find user in server members
            let member = members.filter((e)=>{
                return (e.id == userId);
            })[0];
            
            if (member.nickname) {
                comingNicks.push({nick: member.nickname, vote: user.vote || "?"});
            }else{
                comingNicks.push({nick: user.username, vote: user.vote || "?"});
            }
            
        });

        let comingPeopleString = "";
        comingNicks.forEach((e)=>{
            comingPeopleString += `**${e.vote}** - ${e.nick}\n`;
        });

        if (comingNicks.length == 0) {
            comingPeopleString = "None";
        }

        msg.channel.send({
            "embed": {
                "title": "DP Stats",
                "description": `
                    ${dp.details}
                    **List of people coming (${comingNicks.length}):**
                    ${comingPeopleString}
                `,
                "color": CONSTS.COLORS.BLUE
            }
        });
    }
};