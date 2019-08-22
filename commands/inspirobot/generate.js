const CONFIG = require("/modules/config");
const outdent = require("outdent");
const inspiroBotApi = require("./api");

module.exports = {
    handler: async function (messageEventData) {
        let imageUrl;
        try {
            imageUrl = await inspiroBotApi.getImage();
        }catch(e){
            console.log("InspiroBot API fetch error: " + e);
            try {
                module.exports.responses.fail.fetchError(messageEventData);
            }catch(e) {
                throw("Failed to send fail msg: " + e);
            }
            return 1;
        }

        try {
            await messageEventData.msg.channel.send({files: [imageUrl]});
        }catch(e){
            throw("Failed to send file back: " + e);
        }

        return 0;
    },

    responses: {
        fail: {
            fetchError: async function(messageEventData) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "InspiroBot | Fetch error",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                Could not fetch image from the API.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(messageEventData)
                        }
                    });
                } catch (e) {
                    throw ("Failed to send 'failed to fetch' message: " + e);
                }
            }
        }
    }
};