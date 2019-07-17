const crypto = require("crypto");

module.exports = {
    generate: async function(msgId) {
        let randToken = crypto.randomBytes(24).toString('hex');

        return `${randToken}&${msgId}`;
    }
};