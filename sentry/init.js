/*

    Sentry initialization module
    Connects to sentry

*/

const CONFIG = require("../modules/config");
const Sentry = require('@sentry/node');

module.exports = {
    init: function() {
        if (!CONFIG.SECRETS.SENTRY.DSN) {
            console.log("/!\\ WARNING /!\\".warn);
            console.log("Sentry DSN url not provided - SENTRY ERROR TRACKING IS DISABLED!".warn);
            console.log("If you're testing locally, you can ignore this error.".warn);
            console.log("If this code is running in production, please provide your own sentry DSN url for error tracking.".warn);
            return false;
        }
        Sentry.init({ dsn: CONFIG.SECRETS.SENTRY.DSN });
        return "Fuck";
    }
};