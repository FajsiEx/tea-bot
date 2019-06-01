const CONFIG = require("../../modules/config");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;
            let content = msg.content;

            let eventDateString = content.split(" ")[1];
            let eventContentString = content.slice(content.indexOf(content.split(" ")[2]));

            console.log(eventDateString);
            console.log(eventContentString);

        });
    }
};