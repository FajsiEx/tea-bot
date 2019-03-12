
const COLORS = require("../../consts").COLORS;
const smallFunctions = require("../../smallFunctions");

module.exports = {
    command: function(msg) {
        if(smallFunctions.checkAdmin(msg)) {
            let mentionList = msg.mentions.users;
            console.log("[DEBUG] Unsilence, ML(" + JSON.stringify(mentionList))
            if(mentionList.array().length == 0) {
                msg.channel.send({
                    "embed": {
                        "title": "Boi tomu nechápem. Šak !unmute/unsilence @niekto [Nemám koho unmutnút]",
                        "color": COLORS.RED
                    }
                }).then(msg => msg.delete(10000));
                return;
            }

            let role = msg.guild.roles.find(r => r.name == "Muted");
            let user = msg.mentions.members.first();

            console.log("[MUTE] Unmuted "+ user.name + ".");
            user.removeRole(role).catch(console.error);

            console.log("[MUTE] Unmuted "+ user.username + "#" + user.discriminator);
            msg.channel.send({
                "embed": {
                    "title": "Hotovo.",
                    "color": COLORS.GREEN
                }
            }).then(msg => msg.delete(10000));
            return;
        }else{
            msg.channel.send({
                "embed": {
                    "title": "Tento príkaz môžu vykonávať len admini",
                    "color": COLORS.RED
                }
            }).then(msg => msg.delete(5000));
            return;
        }
    }
}