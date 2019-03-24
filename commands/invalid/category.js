const CONFIG = require("../../modules/config");

module.exports = {
    handler: (handleData)=>{
        let msg = handleData.msg;
        msg.channel.send({
            embed: {
                "title": "Invalid command category",
                "color": CONFIG.EMBED.COLORS.FAIL,
                "description": `
                    Look at the docs for valid command categories and their commands
                `,
                "footer": CONFIG.EMBED.FOOTER
            }
        });
    }
}