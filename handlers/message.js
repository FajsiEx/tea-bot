const CONFIG = require("../modules/config");
const commandHandler = require("./command").handler;
const handleDataCheck = require("../checks/handleData").check;

module.exports = {
    handler: (handleData)=>{
        if (handleDataCheck(handleData)) {
            console.log("[HANDLER:MSG] handleData check failed. Returning false.");
            return false;
        }

        if (handleData.msg.content.startsWith(CONFIG.DISCORD.PREFIXES[0])) {
            console.log("[HANDLER:MSG] Passing off to COMMAND handler");
            commandHandler(handleData);
            return true;
        }
    }
};