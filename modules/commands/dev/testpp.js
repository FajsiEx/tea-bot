
const COLORS = require("../../consts").COLORS;
const globalVariables = require("../../globalVariables");

module.exports = {
    command: function(msg) {
        let commandMessageArray = msg.content.split(" ");

        let usersObj = globalVariables.get("usersObj");
        let usersObjString;
        let users = Object.keys(usersObj); // Gets keys (users) of the usersObj

        switch (commandMessageArray[1]) {
            case "users":
                for (user of users) { // For each user
                    let userObj = usersObj[user];
                    usersObjString += `**ID:**${user} **UN:**${userObj.username} **AW:**${userObj.agreedWarning}\n`
                }

                msg.channel.send({
                    "embed": {
                        "title": "PrettyPrint for usersObj",
                        "color": COLORS.BLUE,
                        "description": usersObjString
                    }
                });
                break;

            default:
                msg.channel.send({
                    "embed": {
                        "title": "Invalid attr",
                        "color": COLORS.RED,
                        "description": "Enter valid attr for testpp command."
                    }
                }).then(msg => msg.delete(5000));
        }
    }
}