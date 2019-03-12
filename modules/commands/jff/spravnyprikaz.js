
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg) {
        msg.reply({
            "embed": {
                "title": "Si myslíš, že si múdry, čo?",
                "color": COLORS.RED,
                "description": 'Hahahahahahahahahahahahaha...strašne vtipné normálne sa smejem XD'
            }
        });
    }
}