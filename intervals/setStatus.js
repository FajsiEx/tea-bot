const CONFIG = require("/modules/config");
const dbBridge = require("/db/bridge");

module.exports = {
    interval: function (dClient) {
        let activityString = `with ${dClient.guilds.size} guilds | ${CONFIG.BOT.BUILD_INFO.BUILD_STRING} | ${module.exports.getTimeString()}`;

        if (!dbBridge.isDBReady()) {
            dClient.user.setStatus("idle");
        } else {
            dClient.user.setStatus("online");
        }
        
        dClient.user.setActivity(activityString, { type: "PLAYING" });

    },

    setup: function (dClient) {
        setInterval(async ()=>{
            try {
                await this.interval(dClient);
            }catch(e){
                console.log(`Failed to setStatus: ${e}`.error);
            }
        }, 15000);
    },

    getTimeString: function () {
        let dt = new Date();
        let hours = (dt.getHours() < 10 ? '0' : '') + dt.getHours();
        let minutes = (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
        let seconds = (dt.getSeconds() < 10 ? '0' : '') + dt.getSeconds();

        return `${hours}:${minutes}:${seconds}`;
    }
};