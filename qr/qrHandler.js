const qrData = require("./qrData");

module.exports = {
    handler: async function (handleData) {
        // Additional check for non-standard property
        let usedCommand = handleData.usedCommand;

        if (!usedCommand) {
            throw ("Handle data does not have usedCommand");
        }

        let requestedResponse = qrData.filter(qr => { // Get command itself from the category by the command name entered.
            return qr.keywords.indexOf(usedCommand) > -1;
        })[0];

        if (!requestedResponse) {
            throw ("No response was found for parsed keyword: " + usedCommand);
        }

        let responseHandler;

        switch (requestedResponse.type) {
            case "plain":
                responseHandler = module.exports.responseHandlers.plain;
                break;
            case "file":
                responseHandler = module.exports.responseHandlers.file;
                break;
            default:
                throw ("Invalid type of qr. Idk what to do with it. Programmer drunk lol.");
        }

        try {
            await responseHandler(handleData, requestedResponse);
        } catch (e) {
            throw (`Response handler rejected: ${e}`);
        }

        return 0;
    }, // End of handler

    responseHandlers: {
        plain: async function (handleData, qr) {
            try {
                await handleData.msg.channel.send(qr.data);
            } catch (e) {
                throw ("Failed to send plain QR response: " + e);
            }
            return 0;
        },
        file: async function (handleData, qr) {
            try {
                await handleData.msg.channel.send({ files: [qr.data] });
            } catch (e) {
                throw ("Failed to send attach QR response: " + e);
            }
            return 0;
        }
    }
};