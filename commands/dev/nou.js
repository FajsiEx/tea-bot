const CONFIG = require("/modules/config");
const outdent = require("outdent");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let i = 0;

        while (i < 5) {
            i++;
            try {
                await msg.channel.send("no u #" + i);
            } catch (e) {
                throw ("Failed sending message: " + e);
            }
        }

        return 0;
    }
};