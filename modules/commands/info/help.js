
const COLORS = require("../../consts").COLORS;
const VERSION = require("../../consts").VERSION;

module.exports = {
    command: function(msg) {
        let branchString = "Running in *stable* mode."
        if (process.env.DISABLE_SAVE == "yes") {
            branchString = "Running in *beta* mode. Debug options are enabled and database saving is disabled. **ALL DATA WILL BE GONE UPON REBOOT**"
        }

        msg.channel.send({
            "embed": {
                "title": "Help",
                "color": COLORS.BLUE,
                "description": `
                    ***Tea-bot project*** *v.${VERSION}*
                    Copyright 2018-2019 FajsiEx (Licensed under MIT license)
                    ${branchString}
                    
                    [Všetky príkazy a changelog](https://fajsiex.ml/docs/tea-bot.html)
                    [GitHub repo (source)](https://github.com/FajsiEx/tea-bot)
                `
            }
        });
    }
}