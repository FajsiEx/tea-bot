const CONFIG = require("../../modules/config");

const outdent = require("outdent");
const eduApi = require("./api");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let commandLength = msg.content.split(" ")[0].length + 1;
        let date = msg.content.slice(commandLength);

        let substDate = msg.createdAt;

        let substDay, substMonth, substYear;

        [substDay, substMonth, substYear] = date.split(".");

        substDay = parseInt(substDay);
        substMonth = parseInt(substMonth);
        substYear = parseInt(substYear);

        if (substDay) {
            substDate.setDate(substDay);
        }
        if (substMonth) {
            substDate.setMonth(substMonth - 1);
        } // We need -1 bc january = 0 in js
        if (substYear) {
            substDate.setYear(substYear);
        }

        console.log(substDay, substMonth, substYear);
        console.log(substDate.getMonth());

        let responseText;
        try {
            responseText = await eduApi.getSubstStringForDate(substDate);
        }catch(e){
            throw("getSubstStringForDate rejected: " + e);
        }

        try {
            await msg.channel.send({
                embed: {
                    title: "Edu | Substitution",
                    color: CONFIG.EMBED.COLORS.INFO,
                    description: outdent`
                        ${responseText}
                    `,
                    footer: CONFIG.EMBED.FOOTER(messageEventData)
                }
            });
        } catch (e) {
            throw ("Could not send message: " + e);
        }
        return 0;
    },

    responses: {

    }
};
