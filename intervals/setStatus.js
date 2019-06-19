const CONFIG = require("/modules/config");
const dbBridge = require("/db/bridge");

module.exports = {
    interval: function (dClient) {
        let activityString = `with ${dClient.guilds.size} guilds | ${CONFIG.BOT.BUILD_INFO.BUILD_STRING} | ${module.exports.getTimeString()}`;

        dClient.user.setActivity(activityString, { type: "PLAYING" });

        if (!dbBridge.isDBReady()) {
            dClient.user.setStatus("idle");
        } else {
            dClient.user.setStatus("online");
        }
    },

    getTimeString: function () {
        let dt = new Date();
        let hours = (dt.getHours() < 10 ? '0' : '') + dt.getHours();
        let minutes = (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
        let seconds = (dt.getSeconds() < 10 ? '0' : '') + dt.getSeconds();

        return `${hours}:${minutes}:${seconds}`;
    }
};