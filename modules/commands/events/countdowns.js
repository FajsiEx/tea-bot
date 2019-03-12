
const COLORS = require("../../consts").COLORS;
const HOLIDAYS = require("../../consts").HOLIDAYS;

module.exports = {
    command: function(msg) {
        let holidaysString = "";
        nowStamp = new Date().getTime();

        HOLIDAYS.forEach((e)=>{
            deltaStamp = e.date.getTime() - nowStamp;
            days = Math.floor(deltaStamp / 86400000);
            holidaysString+=`**${days}d** - ${e.name}\n`
        });

        msg.channel.send({
            "embed": {
                "title": "Countdowns",
                "color": COLORS.BLUE,
                "description": holidaysString
            }
        });
    }
}