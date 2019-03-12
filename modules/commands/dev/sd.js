
const COLORS = require("../../consts").COLORS;
const DEV_USERID = require("../../consts").DEV_USERID;
const globalVariables = require("../../globalVariables");

let shutdownTimeoutId;

module.exports = {
    command: function(msg, discordClient) {
        let commandMessageArray = msg.content.split(" ");

        if (commandMessageArray[1] == undefined) {
            msg.channel.send({
                "embed": {
                    "title": "No attr",
                    "color": COLORS.RED,
                    "description": "No attr for !sd command."
                }
            });
            return;
        }

        if (msg.author.id != DEV_USERID) {
            msg.channel.send({
                "embed": {
                    "title": "Dev only.",
                    "color": COLORS.RED
                }
            });
            return;
        }

        let timeout = parseInt(commandMessageArray[1]);
        let reason = msg.content.slice(msg.content.indexOf(msg.content.split(" ", 2)[1]) + msg.content.split(" ", 2)[1].length + 1);

        timeout = timeout * 60000;

        globalVariables.set('disableStatus', true);

        discordClient.user.setStatus('idle').then(()=>{
            setTimeout(()=>{discordClient.user.setActivity("myself die in " + commandMessageArray[1] + " min. because of " + reason, { type: "watching" })}, 2500);
        });

        shutdownTimeoutId = setTimeout(()=>{
            discordClient.user.setStatus('offline').then(()=>{
                setTimeout(()=>{discordClient.user.setActivity("nothing.", { type: "watching" })}, 2500);
            });
            setTimeout(()=>{process.exit(50);}, 5000);
        }, timeout);

        console.log("[SD] DEBUG: timeoutId:" + shutdownTimeoutId); // so i pass that fucking check

        msg.channel.send({
            "embed": {
                "title": "*Done*",
                "color": COLORS.GREEN,
                "description": "Shutdown was scheduled."
            }
        });
    }
}