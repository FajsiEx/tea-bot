
const globalVariables = require("../../../globalVariables");
const CONSTS = require("../../../consts");

module.exports = {
    command: function(msg) {
        let commandMessageArray = msg.content.split(" ");

        let dp = globalVariables.get("dp");
        console.dir(dp);

        if (!dp) { // If the DP object is empty
            msg.channel.send({
                "embed": {
                    "title": "",
                    "description": `
                        Žiadna doplnková hodina
                    `,
                    "color": CONSTS.COLORS.RED
                }
            }).then((botMsg)=>{
                botMsg.delete(60000);
            });
            return;
        }

        let subjectVoted = commandMessageArray[1];

        if (!subjectVoted) {
            msg.channel.send({
                "embed": {
                    "title": "Žiadny predmet",
                    "description": `
                        Musíte si zvoliť predmet na DP
                        !dp ${CONSTS.SUBJECTS.join("-")}

                        napr. !dp ZEQ
                    `,
                    "color": CONSTS.COLORS.RED
                }
            }).then((botMsg)=>{
                botMsg.delete(60000);
            });
            msg.delete(1000);
            return;
        }

        subjectVoted = subjectVoted.toUpperCase();
        
        if (CONSTS.SUBJECTS.indexOf(subjectVoted) == -1) {
            msg.channel.send({
                "embed": {
                    "title": "Neplatný predmet",
                    "description": `
                        !dp ${CONSTS.SUBJECTS.join(",")}

                        ex. !dp ZEQ
                    `,
                    "color": CONSTS.COLORS.RED
                }
            }).then((botMsg)=>{
                botMsg.delete(60000);
            });
            msg.delete(1000);
            return;
        }

        // AFTER CHECKS
        // Vote is now valid so we can store it
        dp.joined[msg.author.id] = {
            username: msg.author.username,
            vote: subjectVoted
        };

        msg.channel.send({
            "embed": {
                "title": "Prihlásený na " + subjectVoted,
                "description": `
                    Great job!
                `,
                "color": CONSTS.COLORS.GREEN
            }
        });
    }
};