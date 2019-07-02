const CONFIG = require("../../modules/config");
const dbInt = require("../../db/interface");

module.exports = {
    generator: async function (generatorData) {
        let guildId = generatorData.guildId;

        let guildDoc;
        try {
            guildDoc = await dbInt.getGuildDoc(guildId);
        } catch (e) {
            throw ("Could not get guild doc");
        }

        if (!guildId) {
            throw ("False guildId");
        }

        let eventsArray = guildDoc.events;
        if (!Array.isArray(eventsArray)) { // If the thing does not exist, simulate it.
            console.log(`False events array in guildDoc [${guildDoc.guildId}] . Simulating empty array for you ;)`.warn);
            eventsArray = [];
        }

        eventsArray.sort(function(a, b){return a.date.getTime() - b.date.getTime();});
        

        //* CATEGORIES
        let categories = [
            {
                name: "24 hours",
                maxDelta: 24*60*60*1000,
                events: []
            },
            {
                name: "48 hours",
                maxDelta: 48*60*60*1000,
                events: []
            },
            {
                name: "Week",
                maxDelta: 7*24*60*60*1000,
                events: []
            },
            {
                name: "Month",
                maxDelta: 30*24*60*60*1000,
                events: []
            },
            {
                name: "Year",
                maxDelta: 365.25*24*60*60*1000,
                events: []
            },
            {
                name: "Other",
                maxDelta: Infinity,
                events: []
            },
        ];

        const currentTime = new Date().getTime();

        for (let event of eventsArray) {
            if (event.date.getTime() < new Date().getTime()) { continue; } // If the event is expired, move on

            for(let category of categories) {
                if (event.date.getTime() < currentTime + category.maxDelta) {
                    category.events.push(event);
                    break;
                }
            }
        }

        let resultEventString = "";

        for (let category of categories) {
            if (category.events.length < 1) { continue; } // We don't want to output categories which have no events in them

            resultEventString += `**${category.name}**\n`;
            
            for (let event of category.events) {
                resultEventString += `**\`${event.date.getDate()}.${event.date.getMonth() + 1}.${event.date.getFullYear()}\`** ${event.content}\n`;
            }

            resultEventString += "\n";
        }


        /* eventsArray.forEach((event) => {
            if (event.date.getTime() < new Date().getTime()) { return; } // If the event is expired, return
            resultEventString += `**\`${event.date.getDate()}.${event.date.getMonth() + 1}.${event.date.getFullYear()}\`** ${event.content} \n`;
        }); */

        return {
            "embed": {
                "title": "Events",
                "color": CONFIG.EMBED.COLORS.STICKY,
                "description": `
                    ${resultEventString}
                `,
                "footer": CONFIG.EMBED.FOOTER()
            }
        };
    }
};