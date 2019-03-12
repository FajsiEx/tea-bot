
const globalVariables = require("../../globalVariables");
const COLORS = require("../../consts").COLORS;
const DEV_USERID = require("../../consts").DEV_USERID;

module.exports = {
    command: function(msg) {
        let commandMessageArray = msg.content.split(" ");

        if (msg.author.id != DEV_USERID) {
            msg.channel.send({
                "embed": {
                    "title": "Devs only. For now. If you also want this just DM @FajsiEx. Also this no longer works.",
                    "color": COLORS.RED
                }
            });
            return;
        }

        if (!commandMessageArray[1]) {
            msg.channel.send({
                "embed": {
                    "title": `No osu! user id :/ fok. Don't play osu? Then go away.`,
                    "color": COLORS.RED
                }
            });
            return;
        }

        if (!commandMessageArray[2]) {
            msg.channel.send({
                "embed": {
                    "title": `No prefix for your nickname specified. **!sosum *osuID* Your name** => **Your name [#1,273]**`,
                    "color": COLORS.RED
                }
            });
            return;
        }

        //let commandLength = commandMessageArray[0].length;
        //let firstParamLength = commandMessageArray[1].length;
        let indexOfSecondParam = msg.content.indexOf(commandMessageArray[2]);
        let nicknamePrefix = msg.content.slice(indexOfSecondParam);

        let dynamicNickUpdates = globalVariables.get("dynamicNickUpdates");
        if (!dynamicNickUpdates) {
            dynamicNickUpdates = [];
        }

        dynamicNickUpdates.push({
            userID: msg.author.id,
            guild: msg.guild,
            prefix: nicknamePrefix,
            type: "osu",
            data: {
                osuID: commandMessageArray[1]
            }
        });

        globalVariables.set("dynamicNickUpdates", dynamicNickUpdates);

        msg.channel.send({
            "embed": {
                "title": `Dynamic nickname set. Nicknames can take up to 30 seconds to take changes.`,
                "color": COLORS.GREEN
            }
        });
    }
};