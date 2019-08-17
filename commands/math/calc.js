const CONFIG = require("/modules/config");
const outdent = require("outdent");
const math = require("mathjs");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let commandLength = msg.content.split(" ")[0].length + 1;
        let expression = msg.content.slice(commandLength);

        if (!expression) {
            try {
                await module.exports.responses.fail.noExpression(messageEventData);
            }catch(e){
                throw("Failed sending noResults message: " + e);
            }
            return 1;
        }

        // Replace these things
        expression = expression.replace(/×/g, '*');
        expression = expression.replace(/x/g, '*');

        let result;
        try {
            result = math.eval(expression);
        }catch(e) {
            module.exports.responses.fail.invalidExpression(messageEventData);
            return 2;
        }

        try {
            await module.exports.responses.success.result(messageEventData, expression, result);
        }catch(e){
            throw("Failed sending success message: " + e);
        }
        return 0;
    },

    responses: {
        success: {
            result: async function(messageEventData, expression, result) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "Math | Calculate",
                            "color": CONFIG.EMBED.COLORS.SUCCESS,
                            "description": outdent`
                                \`${expression}\`

                                =**${result}**
                            `,
                            "footer": CONFIG.EMBED.FOOTER(messageEventData)
                        }
                    });
                } catch (e) {
                    throw ("Failed sending message: " + e);
                }
                return;
            }
        },

        fail: {
            noExpression: async function(messageEventData) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "Math | Calculate",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                No expression was provided.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(messageEventData)
                        }
                    });
                } catch (e) {
                    throw ("Failed sending message: " + e);
                }
                return;
            },
            invalidExpression: async function(messageEventData) {
                try {
                    await messageEventData.msg.channel.send({
                        "embed": {
                            "title": "Math | Calculate",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                Invalid expression.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(messageEventData)
                        }
                    });
                } catch (e) {
                    throw ("Failed sending message: " + e);
                }
                return;
            }
        }
    }
};