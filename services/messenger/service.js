const fbMessenger = require("facebook-chat-api");
const dbBridge = require("../../db/bridge");

module.exports.init = function() {
    fbMessenger({email: process.env.T_FB_USER, password: process.env.T_FB_PASS, forceLogin: true}, (err, api)=>{
        if (err) return console.log(err);

        api.listen((err, msg)=> {
            console.log("[SERVICE: MESSENGER] Message event", msg);
        });
    });
};

module.exports.messageEventHandler = function(msg) {
    
};

module.exports.bridgingHandler = function(msg) {

};