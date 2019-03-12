
const COLORS = require("../../consts").COLORS;
const globalVariables = require("../../globalVariables");

module.exports = {
    command: function(msg) {
        let events = globalVariables.get("events");

        /*if (!smallFunctions.checkAdmin(msg)) {
             allowed = false;
             msg.channel.send({
                 "embed": {
                     "title": "Tento príkaz môžu vykonávať len admini lol",
                     "color": COLORS.RED
                 }
             });
             return;
         }
         */
        
         // TODO: Improve this.

        let commandMessageArray = msg.content.split(" ");
        let eventIdToDelete = parseInt(commandMessageArray[1]);

        if (!eventIdToDelete) {
            msg.channel.send({
                "embed": {
                    "title": "!vymazat/delete <eventId> (!delete 5; !vymazat 12)",
                    "color": COLORS.RED
                }
            });
            return;
        }

        let eventToDelete = events.filter((e)=>{
            return e.eventId == eventIdToDelete;
        })[0];

        if (eventToDelete) { // If the event that is to be deleted was found
            events = events.filter((e)=>{ // Pass all events except the event that we want to delete
                return e.eventId != eventIdToDelete;
            });

            globalVariables.set("events", events); // and save those.

            msg.channel.send({
                "embed": {
                    "title": `Event **[#${eventIdToDelete}] ${eventToDelete.content}** bol vymazaný.`,
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