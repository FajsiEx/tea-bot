
const globalVariables = require("../../globalVariables");

module.exports = {
    command: function(msg) {
        let usersObj = globalVariables.get("usersObj");
        usersObj[msg.author.id].agreedWarning = true;
        globalVariables.set("usersObj", usersObj);
    }
}