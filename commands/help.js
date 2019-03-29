const CONFIG = require("../modules/config");

module.exports = {
    handler: (handleData)=>{
        let msg = handleData.msg;
        msg.channel.send({
            embed: {
                "title": "Tea-bot | Help",
                "color": CONFIG.EMBED.COLORS.INFO,
                "description": `
                    Tea-bot Project
                    Build ${CONFIG.BOT.BUILD_INFO.BUILD_STRING}
                `,
                "footer": CONFIG.EMBED.FOOTER
            }
        });
    }
}