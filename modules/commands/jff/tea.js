
const globalVariables = require("../../globalVariables");

module.exports = {
    command: function(msg) {
        let teas = globalVariables.get("teas");
        teas++;
        globalVariables.set("teas", teas);
        msg.channel.send("Tu je tvoj čaj. Spotrebovalo sa už **" + teas + "** čajov");
    }
}