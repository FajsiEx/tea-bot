const CONFIG = require("../../modules/config");

module.exports = {
    handler: (handleData)=>{
        let msg = handleData.msg;
        msg.channel.send({
            "embed": {
                "title": "Congrats :D",
                "color": CONFIG.EMBED.COLORS.INFO,
                "description": `
                🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
                `,
                "footer": CONFIG.EMBED.FOOTER
            }
        });
    }
}