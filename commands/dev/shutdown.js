const CONFIG = require("../../modules/config");

module.exports = {
    handler: (handleData)=>{
        let msg = handleData.msg;
        msg.channel.send({
            "embed": {
                "title": "Shutdown",
                "color": CONFIG.EMBED.COLORS.INFO,
                "description": `
                    Ok then. Here goes nothing.
                `,
                "footer": CONFIG.EMBED.FOOTER(handleData)
            }
        });

        handleData.dClient.destroy();
    }
};