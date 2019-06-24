/*

    Tea-bot
    © FajsiEx 2019
    Licensed under MIT license - see LICENSE.md for the full license text

*/

require("./inits/consoleColors").init();
require('sexy-require'); // For those nice absolute paths

let CONFIG = require("./modules/config");

console.log("[BOOT] Modules loaded".success);

//CONFIG.SENTRY.IS = require("./sentry/init").init();

console.log("[BOOT] Sentry initialized".success);

require("./discord/client").init();
const dClient = require("./discord/client").getDiscordClient();

console.log("[BOOT] Initialized Discord client".success);

require("./api/server").init(dClient);
require("./modules/stats").init(dClient);

console.log("[BOOT] Initialized express API server".success);

dClient.login(CONFIG.SECRETS.DISCORD.TOKEN).then(()=>{
    console.log("[BOOT] Logged in.".success);
}); // Auth with the discord auth token
