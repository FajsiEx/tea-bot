
const COLORS = require("../../consts").COLORS;
const smallFunctions = require("../../smallFunctions");

module.exports = {
    command: function(msg) {
        let commandMessageArray = msg.content.split(" ");
        
        if(smallFunctions.checkAdmin(msg)) {
            let minutes = parseInt(commandMessageArray[1]);
            if(!minutes) {
                msg.channel.send({
                    "embed": {
                        "title": "Boi tomu nechápem. Šak !mute/silence <minuty> @niekto  [Chýbajú minúty]",
                        "color": COLORS.RED
                    }
                });
                return;
            }

            if(minutes > 60) {
                msg.channel.send({
                    "embed": {
                        "title": "Boi to je až mooooc minút...max je 60.",
                        "color": COLORS.RED
                    }
                });
                return;
            }

            let mentionList = msg.mentions.users;
            console.log("[DEBUG] Silence, ML(" + JSON.stringify(mentionList))
            if(mentionList.array().length == 0) {
                msg.channel.send({
                    "embed": {
                        "title": "Boi tomu nechápem. Šak !mute/silence <minuty> @niekto [Nemám koho mutnút]",
                        "color": COLORS.RED
                    }
                });
                return;
            }

            let role = msg.guild.roles.find(r => r.name == "Muted");
            let user = msg.mentions.members.first();
            user.addRole(role).catch(console.error);

            setTimeout(()=>{
                console.log("[MUTE] Muted "+ user.name + ".");
                user.removeRole(role).catch(console.error);
            }, minutes*60000);
            
            msg.channel.send({
                "embed": {
                    "title": "Hotovo.",
                    "color": COLORS.GREEN
                }
            });
            return;
        }else{
            msg.channel.send({
                "embed": {
                    "title": "Tento príkaz môžu vykonávať len admini.",
                    "color": COLORS.RED
                }
            }).then(msg => msg.delete(5000));
            return;
        }
    }
}