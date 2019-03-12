
const COLORS = require("../../consts").COLORS;
const globalVariables = require("../../globalVariables");

module.exports = {
    command: function(msg) {
        let events = globalVariables.get("events");

        let commandMessageArray = msg.content.split(" ");
        let eventIdToEdit = parseInt(commandMessageArray[1]);
        let message = msg.content;
        let newContent = message.slice(message.indexOf(message.split(" ", 2)[1]) + message.split(" ", 2)[1].length + 1);

        if (!eventIdToEdit || !newContent) {
            msg.channel.send({
                "embed": {
                    "title": "!edit <eventId> <na čo zmeniť> (!edit 5 niečo iné)",
                    "color": COLORS.RED
                }
            });
            return;
        }

        let eventToEdit = events.filter((e)=>{
            return e.eventId == eventIdToEdit;
        })[0];

        if (eventToEdit) { // If the event that is to be deleted was found
            events = events.filter((e)=>{ // Pass all events except the event that we want to delete
                return e.eventId != eventIdToEdit;
            });

            eventToEdit.content = newContent;

            events.push(eventToEdit)

            globalVariables.set("events", events); // and save those.

            msg.channel.send({
                "embed": {
                    "title": `Event **[#${eventIdToEdit}]** bol zmenený na **${eventToEdit.content}**.`,
                    "color": COLORS.GREEN
                }
            });
        }else{
            msg.channel.send({
                "embed": {
                    "title": "Event sa nenašiel",
                    "color": COLORS.RED
                }
            });
        }
    }
}