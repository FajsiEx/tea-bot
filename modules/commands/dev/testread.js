
const fs = require('fs');
const COLORS = require("../../consts").COLORS;
const globalVariables = require("../../globalVariables");

module.exports = {
    command: function(msg) {
        let commandMessageArray = msg.content.split(" ");

        let usersObj = globalVariables.get("usersObj");
        let events = globalVariables.get("events");

        let fileName = "JSON_dump.json";

        switch (commandMessageArray[1]) {
            case "events":
                fileName = 'events_JSON_dump_' + Math.floor(Math.random() * 1000000) + '.json'
                fs.writeFile(fileName, JSON.stringify(events), (err)=>{
                    if (err) {
                        msg.channel.send({
                            "embed": {
                                "title": "Error trying to write",
                                "color": COLORS.RED,
                                "description": "Check the logs for more details."
                            }
                        });
                        console.err("[TEST_READ] Failed to write");
                    }

                    msg.channel.send({
                        "embed": {
                            "title": "Raw JSON output of events array",
                            "color": COLORS.GREEN
                        },
                        "files": [
                            fileName
                        ]
                    });
                    console.log('[TEST_READ] File written');
                });
                break;

            case "users":
                fileName = 'usersObj_JSON_dump_' + Math.floor(Math.random() * 1000000) + '.json'
                fs.writeFile(fileName, JSON.stringify(usersObj), (err)=>{
                    if (err) {
                        msg.channel.send({
                            "embed": {
                                "title": "Error trying to write",
                                "color": COLORS.RED,
                                "description": "Check the logs for more details."
                            }
                        });
                        console.err("[TEST_READ] Failed to write");
                    }

                    msg.channel.send({
                        "embed": {
                            "title": "Raw JSON output of usersObj",
                            "color": COLORS.GREEN
                        },
                        "files": [
                            fileName
                        ]
                    });
                    console.log('[TEST_READ] File written');
                });
                break;

            default:
                msg.channel.send({
                    "embed": {
                        "title": "Invalid attr",
                        "color": COLORS.RED,
                        "description": "Enter valid attr for testread command."
                    }
                }).then(msg => msg.delete(5000));
        }
    }
}