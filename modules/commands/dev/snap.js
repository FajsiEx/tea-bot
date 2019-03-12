
const COLORS = require("../../consts").COLORS;
const DEV_USERID = require("../../consts").DEV_USERID;
const globalVariables = require("../../globalVariables");

module.exports = {
    command: function(msg) {
        let commandMessageArray = msg.content.split(" ");

        let usersObj = globalVariables.get("usersObj");
        let events = globalVariables.get("events");

        if (commandMessageArray[1] == undefined) {
            msg.channel.send({
                "embed": {
                    "title": "No attr",
                    "color": COLORS.RED,
                    "description": "No attr for !snap/thanos command."
                }
            });
            return;
        }

        if (commandMessageArray[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().indexOf("pilniky") > -1 && msg.author.id == 305705560966430721) {
            msg.channel.send({
                "embed": {
                    "title": "*snap*",
                    "color": COLORS.RED,
                    "description": "Polovica pilníkov a zvierka zmizli. Perfectly balanced as all things should be."
                }
            });
            return;
        }
        if (commandMessageArray[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf("me") > -1) {
            msg.channel.send({
                "embed": {
                    "title": "No.",
                    "color": COLORS.RED,
                    "description": "Fuck off."
                }
            });
            return;
        }

        if (msg.author.id != DEV_USERID) {
            msg.channel.send({
                "embed": {
                    "title": "Not today m9.",
                    "description": "Tento príkaz môžu vykonavať len developeri z dôvodu aby ho niekto nepoužíval na také neškodné veci ako je napríklad ***VYMAZANIE VŠETKYCH EVENTOV Z DATABÁZY*** alebo ja neviem ***RESETOVANIE VŠETKÝCH SPAM INFORMÁCIÍ O UŽIVATEĽOCH*** a také príjemné veci. **TLDR:** Nemáš všetkých 6 infinity stonov. sry :)",
                    "color": COLORS.RED
                }
            });
            return;
        }

        switch (commandMessageArray[1]) {
            case "events":
                events = [];
                msg.channel.send({
                    "embed": {
                        "title": "*snap*",
                        "color": COLORS.GREEN,
                        "description": "All event data was deleted. Save will happen in the next 10 seconds."
                    }
                });
                globalVariables.set("events", events);
                break;

            case "users":
                usersObj = {};
                msg.channel.send({
                    "embed": {
                        "title": "*snap*",
                        "color": COLORS.GREEN,
                        "description": "All user data was deleted."
                    }
                });
                globalVariables.set("usersObj", usersObj);
                break;

            default:
                msg.channel.send({
                    "embed": {
                        "title": "Invalid attr",
                        "color": COLORS.RED,
                        "description": "Enter valid attr for !snap/thanos command."
                    }
                });
        }
    }
}