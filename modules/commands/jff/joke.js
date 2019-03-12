
const COLORS = require("../../consts").COLORS;
const JOKES = require("../../consts").JOKES;

module.exports = {
    command: function(msg) {
        msg.channel.send({
            "embed": {
                "title": "Haha, vtip",
                "color": COLORS.BLUE,
                "description": JOKES[Math.floor(Math.random() * JOKES.length)]
            }
        });
    }
}