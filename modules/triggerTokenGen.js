const crypto = require("crypto");

module.exports = {
    generate: async function() {
        return crypto.randomBytes(24).toString('hex');
    }
};