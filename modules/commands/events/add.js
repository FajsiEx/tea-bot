
const COLORS = require("../../consts").COLORS;
const WEEK_DAYS_SHORT = require("../../consts").WEEK_DAYS_SHORT;
const globalVariables = require("../../globalVariables");

module.exports = {
    command: function(msg){
        let commandMessageArray = msg.content.split(" ");
        let events = globalVariables.get("events");
        let eventsCounter = globalVariables.get("eventsCounter");
    
        if (!commandMessageArray[1] || !commandMessageArray[2]) { // If there are missing parameters
            this.missingParametersReply(msg); // Tell them
            return; // Don't continue
        }
        
        let author = msg.author.username + "#" + msg.author.discriminator; // User#1337
        let author_id = msg.author.id; // 45656489754512344
        let message = msg.content;

        if (commandMessageArray[1].endsWith(".")) {
            commandMessageArray[1] = commandMessageArray[1].slice(0,-1);
        }
    
        let dateParameter = commandMessageArray[1].split(".").reverse().join(".");
        let dateObj = new Date(dateParameter + " 20:00:00");
    
        if (dateObj == "Invalid Date") { // If the date function can't parse the date string we
            this.invalidDateFormatReply(msg); // Tell the user right format and
            return; // Don't continue
        }
        
        if (dateObj.getFullYear() == 2001) { // When the user doesn't specify the year the Date constructor will add it as 2001
            let currentYear = new Date().getFullYear(); // So we overwrite it with our own year
            dateObj = new Date(dateParameter + "." + currentYear + " 20:00:00");
        }
    
        // This is ugly. Yes, I know. Don't judge me. Who reads this code anyways...right?
        let eventName = message.slice(message.indexOf(message.split(" ", 2)[1]) + message.split(" ", 2)[1].length + 1); // This just extracts the rest of the message (!add 21.12 bla bla bla) => (bla bla bla)... I don't even know how it works or how I came up with this but it works so I won't touch it.
        
        eventsCounter++;

        // We push the event as an object to the events arrat
        events.push({
            time: dateObj.getTime(),
            user_id: author_id,
            user: author,
            content: eventName,
            eventId: eventsCounter
        });
        
        globalVariables.set("events", events);
        globalVariables.set("eventsCounter", eventsCounter);
    
        this.successReply(msg, dateObj, eventName); // And finally we reply the user.
    },
    
    missingParametersReply: function(msg){
        msg.channel.send({
            "embed": {
                "title": "Nesprávny formát príkazu !pridat",
                "color": COLORS.RED,
                "description": 'Použitie: !pridat [datum] [nazov eventu]\n**Príklady:**\n!pridat 23.10 Pisomka z matiky z mnozin\n!pridat 6.4.2018 Adlerka day\n!pridat 09.08 Ja nevim co'
            }
        });
        return;
    },
    
    invalidDateFormatReply: function(msg){
        msg.channel.send({
            "embed": {
                "title": "Nesprávny formát dátumu",
                "color": COLORS.RED,
                "description": 'Použitie: !pridat [datum] [nazov eventu]\n**Príklady:**\n!pridat 23.10 Pisomka z matiky z mnozin\n!pridat 6.4.2018 Adlerka day\n!pridat 09.08 Ja nevim co'
            }
        });
        return;
    },
    
    successReply: function(msg, dateObj, eventName){
        msg.channel.send({
            "embed": {
                "title": "Event bol pridaný",
                "color": COLORS.GREEN,
                "description": `**${WEEK_DAYS_SHORT[dateObj.getDay()]} ${dateObj.getDate()}.${dateObj.getMonth()+1}** - ${eventName}\n`
            }
        });
    }
}