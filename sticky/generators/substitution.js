const CONFIG = require("../../modules/config");
const dbInt = require("../../db/interface");
const eduApi = require("../../commands/edu/api");

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

        let todayDate = new Date();
        let tomorrowDate = new Date(todayDate.getTime() + (24*60*60*1000));

        let todaySubstString = await eduApi.getSubstStringForDate(todayDate);
        let tomorrowSubstString = await eduApi.getSubstStringForDate(tomorrowDate);

        return {
            "embed": {
                "title": "Substitution",
                "color": CONFIG.EMBED.COLORS.STICKY,
                "description": `
                    ***Today - ${todayDate.getDate()}.${todayDate.getMonth() + 1}.${todayDate.getFullYear()}***
                    ${todaySubstString}

                    ***Tomorrow - ${tomorrowDate.getDate()}.${tomorrowDate.getMonth() + 1}.${tomorrowDate.getFullYear()}***
                    ${tomorrowSubstString}
                `,
                "footer": CONFIG.EMBED.FOOTER()
            }
        };
    }
};