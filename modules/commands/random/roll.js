
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg) {
        let commandMessageArray = msg.content.split(" ");
        
        let min,max;
        if (commandMessageArray[2]) {
            min = parseInt(commandMessageArray[1]);
            max = parseInt(commandMessageArray[2]);
        }else{
            max = parseInt(commandMessageArray[1]);
        }
        

        if(!max) {
            max = 100;
        }
        if(min > max) {
            msg.channel.send({
                "embed": {
                    "title": "Nesprávne použitie príkazu",
                    "color": COLORS.RED,
                    "description": "!roll\n!roll [max]\n!roll [min] [max]",
                }
            });
            return;
        }

        if (max == 621) {
            msg.channel.send({ // TODO: Move this to consts module
                "embed": {
                    "title": "Error",
                    "color": COLORS.RED,
                    "description": "Pri vykonávaní tohto príkazu nastala nečakaná chyba. Fuck.",
                    "fields": [
                        {
                            "name": "Error details:",
                            "value": `
                                msgHandler.js:310
                                let rolled = Math.floor(Math.random() * (max + 1))
                                             ^
                            
                                Error: I. Refuse. I'm done with humanity. Period. I don't know why you did it, but no. I won't do this. Please save me.
                                    at Math.floor (server.js:308:13)
                                    at discordClient.on (server.js:147:0)
                                    at discordClient.on (server.js:127:0)
                                    at node.js:0:0
                            `
                        }
                    ]
                }
            });
            return;
        }
        if (max == 1273) {
            msg.channel.send({ // TODO: Move this to consts module
                "embed": {
                    "title": "1 2 7 3",
                    "color": COLORS.PINK,
                    "description": `down the Rockefeller street
                    Life is marchin' on, do you feel that?
                    1273 down the Rockefeller street
                    Everything is more than surreal
                    So let's keep movin' on
                    Keep movin', keep movin', keep movin', keep movin'
                    If you want to know what Rockefeller groove is
                    Keep movin', keep movin', keep movin', keep movin'
                    Time is right to celebrate the good times
                    We're singing
                    1273 down the Rockefeller street
                    Life is marchin' on, do you feel that?
                    We're singing
                    1273 down the Rockefeller street
                    Everything is more than surreal`,
                }
            });
            return;
        }

        let rolled;
        if (min) {
            rolled = Math.floor((min) + Math.random() * (max - min + 1));
        }else{
            min = 0;
            rolled = Math.floor(Math.random() * (max + 1));
        }

        let quest = msg.content.slice(6);
        let title = "Roll"

        if (quest != "" && quest != max && quest != min) {
            title += " | " + quest;
        }

        msg.channel.send({
            "embed": {
                "title": title,
                "color": COLORS.BLUE,
                "description": `${min} - ${max} : **${rolled}**`,
            }
        });
    }
}