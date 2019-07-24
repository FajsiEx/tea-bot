const CONFIG = require("../../modules/config");
const dbInt = require("../../db/interface");
const stickyController = require("../../sticky/stickyController");
const outdent = require("outdent");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;
        let content = msg.content;

        let eventDayString = content.split(" ")[1];
        let eventContentString = content.split(" ")[2] ? content.slice(content.indexOf(content.split(" ")[2])) : false; // If there is !events:add 25 [content] (3 thing split by spaces) slice safely, otherwise mission abort!

        let eventDate = messageEventData.msg.createdAt;

        let eventDay, eventMonth, eventYear;

        if (eventContentString) { // If event date string exists
            [eventDay, eventMonth, eventYear] = eventDayString.split(".");

            eventDay = parseInt(eventDay);
            eventMonth = parseInt(eventMonth);
            eventYear = parseInt(eventYear);
        }

        if (!eventDay || !eventContentString) { // If event day is false (or NaN from parsing) or eventDayString is false (catches above if statement)
            try {
                await module.exports.replyInvalidFormat(messageEventData);
                return 1;
            } catch (e) {
                throw ("Reply invalid format rejected: " + e);
            }
        }

        if (!eventDay || !eventDayString) { // If event day is false (or NaN from parsing) or eventDayString is false (catches above if statement)
            try {
                await module.exports.replyInvalidDate(messageEventData);
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

        let eventObject = {
            content: eventContentString,
            date: eventDate
        };

        let guildDoc;
        try {
            guildDoc = await dbInt.getGuildDoc(messageEventData.msg.guild.id);
        } catch (e) {
            throw ("Couldn't get guildDoc: " + e);
        }

        if (!Array.isArray(guildDoc.events)) {
            guildDoc.events = [];
        }

        guildDoc.events.push(eventObject);

        try {
            await dbInt.setGuildDoc(messageEventData.msg.guild.id, guildDoc);
        } catch (e) {
            throw ("Couldn't set guildDoc: " + e);
        }

        try {
            await stickyController.updateStickyDocs(messageEventData.dClient, messageEventData.msg.guild.id, true);
        } catch (e) {
            throw ("Couldn't autoUpdate stickys: " + e);
        }

        try {
            await messageEventData.msg.channel.send({
                "embed": {
                    "title": "Add event",
                    "color": CONFIG.EMBED.COLORS.SUCCESS,
                    "description": outdent`
                            Done.
                            Event \`${eventContentString}\` was added on \`${eventObject.date.getDate()}.${eventObject.date.getMonth() + 1}.${eventObject.date.getFullYear()}\`
                        `,
                    "footer": CONFIG.EMBED.FOOTER(messageEventData)
                }
            });
        } catch (e) {
            throw ("Failed to send a success message: " + e);
        }

        return 0;
    },

    replyInvalidFormat: async function (messageEventData) {
        try {
            await messageEventData.msg.channel.send({
                "embed": {
                    "title": "Add event",
                    "color": CONFIG.EMBED.COLORS.FAIL,
                    "description": outdent`
                            Invalid format of event.
                            
                            \`!events:add 11 something\` - Adds something on 11.${new Date().getMonth() + 1}.${new Date().getFullYear()}
                            \`!events:add 11.12 something\` - Adds something on 11.12.${new Date().getFullYear()}
                            \`!events:add 11.12.2022 something\` - Adds something on 11.12.2022
                        `,
                    "footer": CONFIG.EMBED.FOOTER(messageEventData)
                }
            });
            return 0;
        } catch (e) {
            throw ("Failed to send a fail message: " + e);
        }
    }
};