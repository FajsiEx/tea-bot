const CONFIG = require("/modules/config");
const dbBridge = require("/db/bridge");

module.exports = {
    interval: function (dClient) {
        let activityString = `with ${dClient.guilds.size} guilds | ${CONFIG.BOT.BUILD_INFO.BUILD_STRING}`;

        if (!dbBridge.isDBReady()) {
            dClient.user.setStatus("idle");
        } else {
            dClient.user.setStatus("online");
        }

        dClient.user.setActivity(activityString, { type: "PLAYING" });

        // const today = new Date();
        // const maturaGoal = new Date("03/15/2022");
        // const maturaDiff = maturaGoal.getTime() - today.getTime();
        // let maturaDays = Math.floor(maturaDiff / (1000 * 60 * 60 * 24));
        // const maturaMonths = Math.floor(maturaDays / 30);
        // maturaDays -= maturaMonths * 30;

        // const holidayGoal = new Date("06/30/2021");
        // const holidayDiff = holidayGoal.getTime() - today.getTime();
        // let holidayDays = Math.floor(holidayDiff / (1000 * 60 * 60 * 24));
        // const holidayMonths = Math.floor(holidayDays / 30);
        // holidayDays -= holidayMonths * 30;

        // dClient.channels.fetch("829451949664763904");
        // dClient.channels.fetch("829755982808350750");

        // dClient.channels
        //     .get("829451949664763904")
        //     .setName(`🚨 Matura za: ${maturaMonths}mes ${maturaDays}dni`);
        // dClient.channels
        //     .get("829755982808350750")
        //     .setName(`🎉 Prazdn za: ${holidayMonths}mes ${holidayDays}dni`);
    },

    setup: function (dClient) {
        setInterval(async () => {
            try {
                await this.interval(dClient);
            } catch (e) {
                console.log(`Failed to setStatus: ${e}`.error);
            }
        }, 15000);
    },

    getTimeString: function () {
        let dt = new Date();
        let hours = (dt.getHours() < 10 ? "0" : "") + dt.getHours();
        let minutes = (dt.getMinutes() < 10 ? "0" : "") + dt.getMinutes();
        let seconds = (dt.getSeconds() < 10 ? "0" : "") + dt.getSeconds();

        return `${hours}:${minutes}:${seconds}`;
    },
};
