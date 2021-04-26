/*

    Tea-bot
    © FajsiEx 2019
    Licensed under MIT license - see LICENSE.md for the full license text

*/

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  // If the message is "ping"
  if (message.content === '!ping') {
    // Send "pong" to the same channel
    message.channel.send('pong');
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.N_DISCORDTOKEN);

// require("./inits/consoleColors").init();
// require('sexy-require'); // For those nice absolute paths

// let CONFIG = require("./modules/config");

// console.log("[BOOT] Modules loaded".success);

// //CONFIG.SENTRY.IS = require("./sentry/init").init();

// //console.log("[BOOT] Sentry initialized".success);

// require("./discord/client").init();
// const dClient = require("./discord/client").getDiscordClient();

// //require("./services/messenger/service").init();

// console.log("[BOOT] Initialized Discord client".success);

// //require("./api/server").init(dClient);
// require("./modules/stats").init(dClient);

// console.log("[BOOT] Initialized express API server".success);

// dClient.login(CONFIG.SECRETS.DISCORD.TOKEN).then(()=>{
//     console.log("[BOOT] Logged in.".success);
// }); // Auth with the discord auth token
