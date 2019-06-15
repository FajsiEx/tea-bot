const qrData = require("./qrData");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            // Additional check for non-standard property
            let usedCommand = handleData.usedCommand;

            if (!usedCommand) {
                return reject("Handle data does not have usedCommand");
            }

            let requestedResponse = qrData.filter(qr => { // Get command itself from the category by the command name entered.
                return qr.keywords.indexOf(usedCommand) > -1;
            })[0];

            if (!requestedResponse) {
                return reject("No response was found for parsed keyword: " + usedCommand);
            }

            let responseHandler;

            switch(requestedResponse.type) {
                case "plain":
                    responseHandler = module.exports.responseHandlers.plain;
                    break;
                case "file":
                    responseHandler = module.exports.responseHandlers.file;
                    break;
                default:
                    return reject("Invalid type of qr. Idk what to do with it. Programmer drunk lol.");
            }

            responseHandler(handleData, requestedResponse).then(()=>{
                return resolve(0);
            }).catch((e)=>{
                return reject("Response handler rejected: " + e);
            });
        }); // End of promise
    }, // End of handler

    responseHandlers: {
        plain: async function (handleData, qr) {
            try {
                await handleData.msg.channel.send(qr.data);
            }catch(e){
                throw("Failed to send plain QR response: " + e);
            }
            return 0;
        },
        file: async function (handleData, qr) {
            try {
                await handleData.msg.channel.send({files:[qr.data]});
            }catch(e){
                throw("Failed to send attach QR response: " + e);
            }
            return 0;
        }
    }
};