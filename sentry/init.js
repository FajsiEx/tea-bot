/*

    Sentry initialization module
    Connects to sentry

*/

const CONFIG = require("../modules/config");
const Sentry = require('@sentry/node');

module.exports = {
    init: function() {
        Sentry.init({ dsn: CONFIG.SECRETS.SENTRY.DSN });
    }
};