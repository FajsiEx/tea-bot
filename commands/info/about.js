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
                        **「 Tea-bot Re:Write 」** *Starting code in a better way from zero*
                        
                        Build **${CONFIG.BOT.BUILD_INFO.BUILD_STRING}**
                        Server message latency: **${new Date().getTime() - msg.createdTimestamp} ms**
                        Server time: **${new Date().toString()}**

                        [Website (tea-bot.ml)](https://tea-bot.ml)
                        [GitHub (tea-bot-projects/tea-bot)](https://github.com/tea-bot-projects/tea-bot)
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