const CONFIG = require("/modules/config");
const outdent = require("outdent");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;
        try {
            await msg.channel.send({
                "embed": {
                    "title": "Tea-bot | About",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": outdent`
                        **「 Tea-bot 」 Project **
                        *${CONFIG.SPLASH_STRINGS.GET()}*
                        
                        Build **${CONFIG.BOT.BUILD_INFO.BUILD_STRING}**
                        Server message latency: **${new Date().getTime() - msg.createdTimestamp} ms**
                        Server time: **${new Date().toString()}**

                        > [Command list](https://beta.fajsiex.ml/projects/teabotre)
                        > [GitHub (tea-bot-project/tea-bot)](https://github.com/tea-bot-project/tea-bot)

                        (c) FajsiEx 2019. Licensed under **MIT** license.
                    `,
                    "footer": CONFIG.EMBED.FOOTER(messageEventData)
                }
            });
        } catch (e) {
            throw ("Failed sending message: " + e);
        }

        return 0;
    }
};