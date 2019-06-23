/*

    Class

*/

const handleId = require("../modules/handleId");

class messageEventData {
    constructor (_dClient, _msg, _footerContent) {
        this.dClient = _dClient;
        this.msg = _msg;
        this.footer = _footerContent;
        this.id = handleId.generate(this.msg);
    }
}

module.exports = messageEventData;