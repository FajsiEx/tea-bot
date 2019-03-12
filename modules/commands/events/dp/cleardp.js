
const globalVariables = require("../../../globalVariables");
const smallFunctions = require("../../../smallFunctions");
const CONSTS = require("../../../consts");

module.exports = {
    command: function(msg) {
        let dp = globalVariables.get("dp");

        if(!smallFunctions.checkAdmin(msg)) {
            msg.channel.send({
                "embed": {
                    "title": "Iba admin môže vytvárať DP",
                    "color": COLORS.RED
                }
            }).then(msg => msg.delete(10000));
            return;
        }

        if (!dp) { // If the object is empty
            msg.channel.send({
                "embed": {
                    "title": "No DP",
                    "description": `
                        Can't delete nothing. Or can I?
                    `,
                    "color": CONSTS.COLORS.RED
                }
            });
            return;
        }

        if(!smallFunctions.checkAdmin(msg) && msg.author.id != dp.opId) {
            msg.channel.send({
                "embed": {
                    "title": "Only admins or OP can delete the DP",
                    "color": COLORS.RED
                }
            }).then(msg => msg.delete(5000));
            msg.delete(1000);
            return;
        }

        dp.msgs.forEach((dpMessage) => {
            dpMessage.delete(); // Delete original messages
        });

        globalVariables.set("dp", false);

        msg.channel.send({
            "embed": {
                "title": "DP Cleared",
                "description": `
                    DP was cleared successfully.
                    Make a DP with !makedp
                `,
                "color": CONSTS.COLORS.GREEN
            }
        })
    }
};