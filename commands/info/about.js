const CONFIG = require("/modules/config");
const outdent = require("outdent");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;
            msg.channel.send({
                "embed": {
                    "title": "Tea-bot | About",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": outdent`
                        **「 Tea-bot Re:Write 」** *Starting code in a better way from zero*
                        
                        Build **${CONFIG.BOT.BUILD_INFO.BUILD_STRING}**
                        Server message latency: **${new Date().getTime() - msg.createdTimestamp} ms**
                        Server time: **${new Date().toString()}**

                        [Website (tea-bot.ml)](https://tea-bot.ml)
                        [GitHub (FajsiEx/tea-bot)](https://github.com/FajsiEx/tea-bot)
                    `,
                    "footer": CONFIG.EMBED.FOOTER(handleData)
                }
            }).then(()=>{
                return resolve(0);
            }).catch((e)=>{
                return reject("Failed sending message: " + e);
            });
        });
    }
};