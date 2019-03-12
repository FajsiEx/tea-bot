
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg) {
        msg.channel.send({
            "embed": {
                "title": "Ping",
                "color": COLORS.BLUE,
                "description": new Date().getTime() - msg.createdTimestamp + "ms"
            }
        });
    }
}