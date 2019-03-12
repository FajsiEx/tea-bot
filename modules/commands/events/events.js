
const COLORS = require("../../consts").COLORS;
const TIMETABLE = require("../../consts").TIMETABLE;
const WEEK_DAYS = require("../../consts").WEEK_DAYS;
const globalVariables = require("../../globalVariables");
const smallFunctions = require("../../smallFunctions");

const EMPTY_STRING = "None";

module.exports = {
    command: function(msg, type) {
        let commandMessageArray = msg.content.split(" ");
        
        let events = globalVariables.get("events");
        events.sort(smallFunctions.compare);
    
        let todayDateString = smallFunctions.dateToDateString(new Date());
        
        let tomorrowDateObj = new Date(new Date().getTime() + 86400000);
        let tomorrowDateString = smallFunctions.dateToDateString(tomorrowDateObj);
        
        let eventsFields = [];
    
        let isToday = ((commandMessageArray[1] == 'dnes') || (type == "dnes"));
        let isTomorrow = ((commandMessageArray[1] == 'zajtra') || (type == "zajtra"));
    
        let timetableTodayArray = TIMETABLE[new Date().getDay()];
        let timetableTomorrowArray = TIMETABLE[tomorrowDateObj.getDay()];
    
        let timetableTodayString = timetableTodayArray.join('  ');
        let timetableTomorrowString = timetableTomorrowArray.join('  ');

        let otherEventsField = {name:"**Other events**", value:""};
        let areOtherEvents = false;

        if (isToday) {
            this.todayEvents(msg, events);
            return;
        }
        if (isTomorrow) {
            this.tomorrowEvents(msg, events);
            return;
        }

        // TODO: REWORK ALL OF BELLOW
        // TODO: Nothing string should be random jff
    
        eventsFields = [ // Default event fields
            {
                name: `**Today ${todayDateString}**   ${timetableTodayString}`,
                value: "Nothing"
            },
            {
                name: `**Tomorrow ${tomorrowDateString}**   ${timetableTomorrowString}`,
                value: "Nothing"
            }
        ];
    
        events.forEach((e)=>{
            if (e.time < new Date().getTime() - 24*60*60*1000) { // If the event is in the past more than 24h don't even bother...just don't...why would you waste so much energy on calculating something so unimportant. But you know what? Everything will end one day so why save power? To hell with this world.
                return;
            }
            
            if (type == "week") { // If the user typed !week
                if (e.time > new Date().getTime() + 604800000) { // If the event is in the futute than 7 days
                    return; // Don't show it (don't add it to the eventsString)
                }
            }

            if (!e.eventId) { // If the event id does not exist
                e.eventId = "?"; // assign "?" to it
            }
    
            let eventDate = new Date(e.time); // Gets date object from the event date
    
            // TODO: replace all of this conversion TECHNOLOGY with a single smallFunction ;)
            let eventDateString = smallFunctions.dateToDateString(eventDate); // Converts date object to date str
    
            if (eventDateString == todayDateString) { // If the event is today

                // TODO: .endsWith() sould be replaced by a bool or smth
                if (eventsFields[0].value.endsWith('Nothing')) { eventsFields[0].value = ""; } // If there is nothing in the default field value, replace it w/ empty string
                eventsFields[0].value += `• [#${e.eventId}] ${e.content}\n`;

            }else if (eventDateString == tomorrowDateString) {

                if (eventsFields[1].value.endsWith('Nothing')) { eventsFields[1].value = ""; }
                eventsFields[1].value += `• [#${e.eventId}] ${e.content}\n`;

            }else{ // If the event is not today or tomorrow

                let eventFieldDate = `**${WEEK_DAYS[eventDate.getDay()]} ${eventDateString}**`;
                let eventDateStringDateFormat = smallFunctions.dateToDateString(eventDate, true); // Converts date object to date str that has only the day and moth switched so Date constructor can pick it up correctly

                areOtherEvents = true;

                let eventDeltaStamp = new Date(eventDateStringDateFormat + " 8:00:00").getTime() - new Date().getTime(); // Distance to the event date @ 8am from the current time
                let eventDaysRem = Math.floor(eventDeltaStamp/1000/60/60/24 * 10) / 10; // f(x*10) / 10 results in v.v format

                otherEventsField.value += `• [#${e.eventId}] ${eventDaysRem}d ${eventFieldDate} ${e.content}\n`;

            }
        });

        if (areOtherEvents) {
            eventsFields.push(otherEventsField);
        }

        msg.channel.send({
            "embed": {
                "title": "Events",
                "color": COLORS.BLUE,
                "fields": eventsFields,
                "footer": {
                    "text": "You can also use: !today/dnes , !tomorrow/zajtra , !week/tyzden"
                }
            }
        });
    },

    todayEvents: function(msg, events) {
        let todayDateString = smallFunctions.dateToDateString(new Date()); // Formats today's date to a xDateString

        let timetableArray = TIMETABLE[new Date().getDay()];
        let timetableString = timetableArray.join(' | ');

        let eventsFields = [{
            name: "**Today - " + todayDateString + "**",
            value: EMPTY_STRING
        }]; // Defines the events fields which will be used as field array in the reply embed object

        eventsFields[0].value = "**" + timetableString + "**\n";

        let eventsEmpty = true;

        events.forEach((e)=>{
            if (!e.eventId) {
                e.eventId = "?";
            }
    
            let eventDate = new Date(e.time);
    
            let eventDateString = smallFunctions.dateToDateString(eventDate); // This will make the date of the event to a format as the xDateString
    
            if (eventDateString == todayDateString) {
                eventsEmpty = false;
                eventsFields[0].value += `• [#${e.eventId}] ${e.content}\n`;
            }
        });

        if (eventsEmpty) {
            eventsFields[0].value += "Nothing";
        }

        msg.channel.send({
            "embed": {
                "title": "Events",
                "color": COLORS.BLUE,
                "fields": eventsFields
            }
        });
    },

    tomorrowEvents: function(msg, events) {
        let tomorrowDateObj = new Date(new Date().getTime() + 86400000);
        let tomorrowDateString = smallFunctions.dateToDateString(tomorrowDateObj); // Formats today's date to a xDateString
        // TODO: Make this in smallFunctions module

        let timetableArray = TIMETABLE[tomorrowDateObj.getDay()];
        let timetableString = timetableArray.join(' | ');

        let eventsFields = [{
            name: "**Tomorrow - " + tomorrowDateString + "**",
            value: EMPTY_STRING
        }]; // Defines the events fields which will be used as field array in the reply embed object

        eventsFields[0].value = "**" + timetableString + "**\n";

        let eventsEmpty = true;

        events.forEach((e)=>{
            if (!e.eventId) {
                e.eventId = "?";
            }
    
            let eventDate = new Date(e.time);
    
            let eventDateString = smallFunctions.dateToDateString(eventDate); // This will make the date of the event to a format as the xDateString
    
            if (eventDateString == tomorrowDateString) {
                eventsEmpty = false;
                eventsFields[0].value += `• [#${e.eventId}] ${e.content}\n`;
            }
        });

        if (eventsEmpty) {
            eventsFields[0].value += "Nothing";
        }

        msg.channel.send({
            "embed": {
                "title": "Events",
                "color": COLORS.BLUE,
                "fields": eventsFields
            }
        });
    }
};