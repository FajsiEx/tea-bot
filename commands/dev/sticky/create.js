const stickyController = require("../../../sticky/stickyController");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            stickyController.createStickyPost({
                guildId: msg.guild.id,
                type: "time",
                channel: msg.channel
            }).then(() => {
                msg.delete(1000).catch(()=>{}); // Delete the request msg. Catch any errors along the way
                return resolve(0);
            }).catch((e) => {
                return reject(`createStickyPost has rejected it's promise: ${e}`);
            });
        }); // End of promise
    } // End of handler
};