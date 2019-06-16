const CONFIG = require("../../modules/config");
const outdent = require("outdent");

module.exports = {
    handler: async function (handleData) {
            let msg = handleData.msg;
            try {
            await msg.channel.send({
                embed: {
                    "title": "Tea-bot | Help",
                    "color": CONFIG.EMBED.COLORS.INFO,
                    "description": outdent`
                        [Website (tea-bot.ml)](https://tea-bot.ml)
                        [GitHub (FajsiEx/tea-bot)](https://github.com/FajsiEx/tea-bot)
                    `,
                    "footer": CONFIG.EMBED.FOOTER(handleData)
                }
            });
        }catch(e){
            throw(`Failed to send response message ${e}`);
        }
        return 0;
    }
};