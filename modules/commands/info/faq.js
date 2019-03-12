
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg) {
        let commandMessageArray = msg.content.split(" ");

        let desc = "idk";

        switch(commandMessageArray[1]) {
            case "mute":
                desc = "[https://support.discordapp.com/hc/en-us/articles/209791877-How-do-I-mute-and-disable-notifications-for-specific-channels-](https://support.discordapp.com/hc/en-us/articles/209791877-How-do-I-mute-and-disable-notifications-for-specific-channels-)"
                break;
            default:
                msg.channel.send({
                    "embed": {
                        "title": "FAQ nenájdené",
                        "color": COLORS.RED
                    }
                });
                return;
        }

        msg.channel.send({
            "embed": {
                "title": "FAQ",
                "color": COLORS.BLUE,
                "description": desc
            }
        });
    }
}