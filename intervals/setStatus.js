const CONFIG = require("../modules/config");

module.exports = {
    interval: function(dClient) {
        console.log("[INTERVAL:SET_STATUS] INTERVAL Set status".interval);

        let activityString = `${dClient.guilds.array().length} guilds | ${CONFIG.BOT.BUILD_INFO.BUILD_STRING} | ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;

        dClient.user.setActivity(activityString, { type: "LISTENING" }).then(()=>{
            console.log(`[INTERVAL:SET_STATUS] DONE Set status to [${activityString}]`.success);
        });
    }
};