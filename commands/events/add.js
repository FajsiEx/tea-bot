const CONFIG = require("../../modules/config");

module.exports = {
    handler: function (handleData) {
        return new Promise(async (resolve, reject) => {
            let msg = handleData.msg;
            let content = msg.content;

            let eventDayString = content.split(" ")[1];
            let eventContentString = content.slice(content.indexOf(content.split(" ")[2]));

            let eventDate = handleData.msg.createdAt;

            console.log(eventDayString);
            console.log(eventContentString);
            console.log(eventDate);

            let eventDay,eventMonth,eventYear;

            if (eventDayString) { // If event date string exists
                eventDay   = parseInt(eventDayString.split(".")[0]);
                eventMonth = parseInt(eventDayString.split(".")[1]);
                eventYear  = parseInt(eventDayString.split(".")[2]);
            }

            if (!eventDay || !eventDayString) { // If event day is false (or NaN from parsing) or eventDayString is false (catches above if statement)
                try {
                    await module.exports.replyInvalidDate(handleData);
                    resolve(1);
                } catch (e) {
                    reject("Reply invalid date rejected: " + e);
                }
                return;
            }

            eventDate.setDate(eventDay);
            if (eventMonth) { eventDate.setMonth(eventMonth - 1); } // We need -1 bc january = 0 in js
            if (eventYear)  { eventDate.setYear(eventYear); }

            console.log(eventDate);

            let eventObject = {
                content: eventContentString
            };

        });
    },

    replyInvalidDate: function (handleData) {
        return new Promise(async (resolve, reject) => {
            try {
                await handleData.msg.channel.send({
                    "embed": {
                        "title": "Add event",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                            Invalid date of event.
                            \`TODO: Add examples\`
                        `, // TODO: Add examples
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                });
                resolve(0);
            } catch (e) {
                reject("Failed to send a message: " + e);
            }
            return;
        });
    }
};