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
                        **「 Tea-bot Re:Write 」 Project **
                        *${CONFIG.SPLASH_STRINGS.GET()}*
                        
                        Build **${CONFIG.BOT.BUILD_INFO.BUILD_STRING}**
                        Server message latency: **${new Date().getTime() - msg.createdTimestamp} ms**
                        Server time: **${new Date().toString()}**

                        (c) FajsiEx 2019. Licensed under **MIT** license.

                        Open source on [GitHub (tea-bot-projects/tea-bot)](https://github.com/tea-bot-project/tea-bot),
                        because open source is the future.
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