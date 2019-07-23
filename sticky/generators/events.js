const CONFIG = require("../../modules/config");
const dbInt = require("../../db/interface");
const outdent = require("outdent");

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
                name: "Less than a day",
                maxDelta: 24*60*60*1000,
                events: []
            },
            {
                name: "Less than 2 days",
                maxDelta: 48*60*60*1000,
                events: []
            },
            {
                name: "Less than a week",
                maxDelta: 7*24*60*60*1000,
                events: []
            },
            {
                name: "Less than a month",
                maxDelta: 30*24*60*60*1000,
                events: []
            },
            {
                name: "Less than 2 months",
                maxDelta: 60*24*60*60*1000,
                events: []
            },
            {
                name: "Less than 3 months",
                maxDelta: 90*24*60*60*1000,
                events: []
            },
            {
                name: "Less than a year",
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
                resultEventString += `**\` ${event.date.getDate()}.${event.date.getMonth() + 1}.${event.date.getFullYear()} (${this.calculateRemainingDays(event.date)}d) \`** ${event.content}\n`;
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
                "description": outdent`
                    ${resultEventString}
                `,
                "footer": CONFIG.EMBED.FOOTER()
            }
        };
    },

    calculateRemainingDays: function(eventDate) {
        let eventTs = eventDate.getTime();
        let currentTs = new Date().getTime();

        let deltaTs = eventTs - currentTs;

        return Math.floor((deltaTs / (24*60*60*1000))*100) / 100;
    }
};