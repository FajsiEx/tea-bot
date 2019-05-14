
const qrData = require("./qrData");

module.exports = {
    handler: (handleData)=>{
        return new Promise((resolve, reject) => {
            // Additional check for non-standard property
            if (!handleData.usedCommand) {
                return reject("Handle data does not have usedCommand");
            }

            console.log("[QR:HANDLER] Called " + handleData.usedCommand);
            resolve(0);
        });
    }
};