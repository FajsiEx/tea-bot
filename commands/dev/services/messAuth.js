const CONFIG = require("../../../modules/config");
const outdent = require("outdent");

let code = "";

module.exports = {
    handler: async function (handleData) {
        let msg = handleData.msg;

        let authCode = msg.content.split(" ")[1];

        code = authCode;
        console.log("Code is now: " + code);
    },

    getCode: function() {
        return code;
    }
};