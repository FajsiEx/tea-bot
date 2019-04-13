const CONFIG = require("../modules/config");

module.exports = {
    interval: function(dClient) {
        console.log("[INTERVAL:SET_STATUS] INTERVAL Set status".interval);

        let activityString = `with ${dClient.guilds.size} guilds | ${CONFIG.BOT.BUILD_INFO.BUILD_STRING} | ${module.exports.getTimeString()}`;

        dClient.user.setActivity(activityString, { type: "PLAYING" }).then(()=>{
            console.log(`[INTERVAL:SET_STATUS] DONE Set status to [${activityString}]`.success);
        });
    },
    
    getTimeString: function() {
        let dt = new Date();
        let hours = (dt.getHours() < 10 ? '0' : '') + dt.getHours();
        let minutes = (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
        let seconds = (dt.getSeconds() < 10 ? '0' : '') + dt.getSeconds();

        return `${hours}:${minutes}:${seconds}`;
    }
};