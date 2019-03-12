
const COLORS = require("../../consts").COLORS;
const DEV_USERID = require("../../consts").DEV_USERID;

const globalVariables = require("../../globalVariables");

module.exports = {
    command: function(msg) {
        let baseLoadingString = "Running self-test...this may take a while... ";

        msg.channel.send({
            "embed": {
                "title": baseLoadingString + "(Init. 1/3)",
                "color": COLORS.BLUE
            }
        }).then((msg)=>{
            let usersObjLength;
            let eventsLength;
            let teasCount;
            let commsServed;
            let serverTimeString;
            let devUserid;
            let authorUserData;
            let uptime;
            let timeSinceLastDataSave;

            msg.edit({
                "embed": {
                    "title": baseLoadingString + "(Load. 2/3)",
                    "color": COLORS.BLUE
                }
            });

            usersObjLength = Object.keys(globalVariables.get("usersObj")).length;
            eventsLength = globalVariables.get("events").length;
            teasCount = globalVariables.get("teas");
            commsServed = globalVariables.get("commandsServed");

            serverTimeString = new Date().toString();
            devUserid = DEV_USERID;
            authorUserData = msg.author.id + " / " + msg.author.username + "#" + msg.author.discriminator;

            nowTime = new Date().getTime();

            deltaTime = nowTime - globalVariables.get("startTime");
            let deltaDate = new Date(deltaTime);

            uptime = `${deltaDate.getHours()}h ${deltaDate.getMinutes()}min ${deltaDate.getSeconds()}s`;

            let timeSinceLastDataSaveTS = nowTime - globalVariables.get("lastSaveTime");
            let timeSinceLastDataSaveDate = new Date(timeSinceLastDataSaveTS);
            timeSinceLastDataSave = `${timeSinceLastDataSaveDate.getHours()}h ${timeSinceLastDataSaveDate.getMinutes()}min ${timeSinceLastDataSaveDate.getSeconds()}s ${timeSinceLastDataSaveDate.getMilliseconds()}ms`;

            msg.edit({
                "embed": {
                    "title": "Self-test done.",
                    "description": `
                        **Users object length:** ${usersObjLength}
                        **Events length:** ${eventsLength}
                        **Teas count:** ${teasCount}
                        **Commands served:** ${commsServed}
                        **Server time string:** ${serverTimeString}
                        **Dev user id:** ${devUserid}
                        **Message author data string:** ${authorUserData}
                        **Server uptime:** ${uptime}
                        **Time since last data save:** ${timeSinceLastDataSave}
                    `,
                    "color": COLORS.GREEN
                }
            });
        });
    }
}