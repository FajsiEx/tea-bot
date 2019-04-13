const CONFIG = require("../modules/config");

module.exports = {
    handler: (handleData) => {
        let msg = handleData.msg;
        msg.channel.send({
            embed: {
                "title": "Tea-bot | Help",
                "color": CONFIG.EMBED.COLORS.INFO,
                "description": `
                    Tea-bot Project
                    by FajsiEx
                    Build ${CONFIG.BOT.BUILD_INFO.BUILD_STRING}
                    Licensed under MIT license.

                    [Website (tea-bot.ml)](https://tea-bot.ml)
                    [GitHub (FajsiEx/tea-bot)](https://github.com/FajsiEx/tea-bot)
                `,
                "footer": CONFIG.EMBED.FOOTER(handleData)
            }
        });
    }
}