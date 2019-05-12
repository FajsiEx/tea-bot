
const qrData = require("./qrData");

module.exports = {
    handler: (handleData, usedCommand)=>{
        return new Promise((resolve, reject) => {
            console.log("[QR:HANDLER] Called " + usedCommand);
            resolve(0);
        });
    }
};