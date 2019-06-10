const CONFIG = require("../../modules/config");
const dbInt = require("../../db/interface");
const stickyController = require("../../sticky/stickyController");

module.exports = {
    handler: async function (handleData) {
        let msg = handleData.msg;
        let content = msg.content;

        let eventDayString = content.split(" ")[1];
        let eventContentString = content.slice(content.indexOf(content.split(" ")[2]));

        let eventDate = handleData.msg.createdAt;

        console.log(eventDayString);
        console.log(eventContentString);
        console.log(eventDate);

        let eventDay, eventMonth, eventYear;

        if (eventDayString) { // If event date string exists
            eventDay = parseInt(eventDayString.split(".")[0]);
            eventMonth = parseInt(eventDayString.split(".")[1]);
            eventYear = parseInt(eventDayString.split(".")[2]);
        }

        if (!eventDay || !eventDayString) { // If event day is false (or NaN from parsing) or eventDayString is false (catches above if statement)
            try {
                await module.exports.replyInvalidDate(handleData);
                return 1;
            } catch (e) {
                throw ("Reply invalid date rejected: " + e);
            }
        }

        eventDate.setDate(eventDay);
        if (eventMonth) {
            eventDate.setMonth(eventMonth - 1);
        } // We need -1 bc january = 0 in js
        if (eventYear) {
            eventDate.setYear(eventYear);
        }

        console.log(eventDate);

        let eventObject = {
            content: eventContentString,
            date: eventDate
        };

        let guildDoc;
        try {
            guildDoc = await dbInt.getGuildDoc(handleData.msg.guild.id);
        } catch (e) {
            throw ("Couldn't get guildDoc: " + e);
        }

        if (!Array.isArray(guildDoc.events)) {
            guildDoc.events = [];
        }

        guildDoc.events.push(eventObject);

        try {
            await dbInt.setGuildDoc(handleData.msg.guild.id, guildDoc);
        } catch (e) {
            throw ("Couldn't set guildDoc: " + e);
        }

        try {
            await stickyController.updateStickyDocs(handleData.dClient, handleData.msg.guild.id, true);
        } catch (e) {
            throw ("Couldn't autoUpdate stickys: " + e);
        }

        try {
            await handleData.msg.channel.send({
                "embed": {
                    "title": "Add event",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
                    "description": `
                            Done.
                            Event \`${eventContentString}\` was added on \`${eventObject.date.getDate()}.${eventObject.date.getMonth()+1}.${eventObject.date.getFullYear()}\`
                        `,
                    "footer": CONFIG.EMBED.FOOTER(handleData)
                }
            });
        } catch (e) {
            throw ("Failed to send a success message: " + e);
        }

        return 0;
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
                reject("Failed to send a fail message: " + e);
            }
            return;
        });
    }
};