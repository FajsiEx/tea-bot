const CONFIG = require("../modules/config");
const commandHandler = require("./command").handler;
const handleDataCheck = require("../checks/handleData").check;

module.exports = {
    handler: function(handleData) {
        if (handleDataCheck(handleData)) {
            console.log("[HANDLER:MSG] handleData check failed. Returning false.");
            return false;
        }
        
        if (handleData.msg.author.bot) {
            console.log("[HANDLER:MSG] Bot message ignored.".debug);
        }

        if (module.exports.stringStartsWithPrefix(handleData.msg.content)) {
            console.log("[HANDLER:MSG] Passing off to COMMAND handler");
            commandHandler(handleData);
            return true;
        }
    },

    stringStartsWithPrefix: function(stringToBeChecked) {
        let containsPrefix = CONFIG.DISCORD.PREFIXES.filter(prefix => {
            return stringToBeChecked.startsWith(prefix);
        })[0];

        return containsPrefix;
    }
};