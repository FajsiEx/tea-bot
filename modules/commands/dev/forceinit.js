
const globalVariables = require("../../globalVariables");
const COLORS = require("../../consts").COLORS;
const DEV_USERID = require("../../consts").DEV_USERID;

module.exports = {
    command: function(msg) {
        if (msg.author.id != DEV_USERID) {
            msg.channel.send({
                "embed": {
                    "title": "Dev only.",
                    "color": COLORS.RED
                }
            });
            return;
        }

        msg.channel.send({
            "embed": {
                "title": "Forced gv module init.",
                "color": COLORS.BLUE
            }
        });

        globalVariables.init();
    }
}