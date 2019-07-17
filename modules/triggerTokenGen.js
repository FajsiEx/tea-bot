const crypto = require("crypto");

module.exports = {
    generate: async function() {
        crypto.randomBytes(24, function(err, buffer) {
            return buffer.toString('hex');
        });
    }
};