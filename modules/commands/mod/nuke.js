
const COLORS = require("../../consts").COLORS;
const smallFunctions = require("../../smallFunctions");

module.exports = {
    command: function(msg) {
        let commandMessageArray = msg.content.split(" ");

        if (msg.channel.type != 'text') {
            msg.channel.send({
                "embed": {
                    "title": "No nuking in anything other than server text channels lul.",
                    "color": COLORS.RED
                }
            });
            return;
        }

        let limit = parseInt(commandMessageArray[1]);
        if(!limit) {
            msg.channel.send({
                "embed": {
                    "title": "Chýba koľko správ vymazať",
                    "color": COLORS.RED
                }
            });
            return;
        }
        
        if (commandMessageArray[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().indexOf("me") > -1) {
            msg.channel.send({
                "embed": {
                    "title": "Hey,",
                    "description": "how 'bout you fuck off. Seriously. Don't. This is not place for this. Stop it, get some help.",
                    "color": COLORS.RED
                }
            }).then(msg => msg.delete(10000));
            return;
        }

        if(!smallFunctions.checkAdmin(msg) || msg.member.roles.some(r=>["EmoteMaster"].includes(r.name))) { // Yes I have allowed this.
            msg.channel.send({
                "embed": {
                    "title": "Admin only.",
                    "color": COLORS.RED
                }
            }).then(msg => msg.delete(5000));
            return;
        }

        let timer = parseInt(commandMessageArray[2]);
        if (!timer) {timer = 0}
        
        timer = timer * 1000;

        if (timer > 60000) {
            msg.channel.send({
                "embed": {
                    "title": "Max 60 sekúnd.",
                    "color": COLORS.RED
                }
            }).then(msg => msg.delete(5000));
            return;
        }

        if (timer > 2) {
            msg.channel.send({
                "embed": {
                    "title": "TACTICAL NUKE INCOMING IN "+ timer/1000 + " SECONDS!!! EVACUATE IMMEDIATELY!!!",
                    "color": COLORS.YELLOW
                }
            }).then(msg => {
                msg.delete(timer - 1);
                let countdown = timer / 1000;
                let intervalId = setInterval(()=>{
                    countdown--;
                    if (countdown < 1) {
                        clearInterval(intervalId);
                    }
                    msg.edit({
                        "embed": {
                            "title": "TACTICAL NUKE INCOMING IN "+ countdown + " SECONDS!!! EVACUATE IMMEDIATELY!!!",
                            "color": COLORS.YELLOW
                        }
                    });
                },1000)
            });
        }

        setTimeout(()=>{
            console.log("[NUKE] Nuked "+ limit + " messages.");
            msg.channel.bulkDelete(limit + 1).then(() => { // +1 because we count the !nuke comm msg too
                msg.channel.send({
                    "embed": {
                        "title": "Deleted "+ limit + " messages.",
                        "color": COLORS.GREEN
                    }
                }).then(msg => msg.delete(5000));
            }).catch((e)=>{
                console.error(e);
                msg.channel.send({
                    "embed": {
                        "title": "Unable to nuke. Maybe some msgs are older than 14 days?",
                        "color": COLORS.RED
                    }
                }).then(msg => msg.delete(5000));
            });
        }, timer);
    }
}