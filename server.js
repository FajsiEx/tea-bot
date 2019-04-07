/*

    Tea-bot
    © FajsiEx 2019
    Licensed under MIT license - see LICENSE.md for the full license text

*/

let startTimestamp = new Date().getTime();
const colors = require('colors');
require("./inits/consoleColors").init();

console.log("[BOOT] WORKING Importing modules".working);

const discordJS = require('discord.js'); // Lib for interacting with the discord API
const CONFIG = require("./modules/config");

const messageHandler = require("./handlers/message").handler;

console.log("[BOOT] DONE Importing modules".success);

console.log("==========================================================");
console.log(CONFIG.AESTHETICS.BOT_LOGO_ASCII);
console.log("Tea-bot project");
console.log("(c) FajsiEx 2019 - under MIT license");
console.log(`Build ${CONFIG.BOT.BUILD_INFO.BUILD_STRING}`);
console.log("==========================================================");

console.log("[BOOT] WORKING Initializing dClient".working);
const dClient = new discordJS.Client(); // Construct a dicord client object
console.log("[BOOT] DONE Initializing dClient".success);

console.log("[BOOT] WORKING Adding event listeners".working);
// Add evennt listeners
dClient.on("ready", ()=>{
    // Call intervals first time
    statusInterval(dClient);

    console.log(`[EVENT:READY] Ready. Delta start-ready: ${new Date().getTime() - startTimestamp}ms`.event);
});

// TODO: Add checks if the dclient is ready
let statusInterval = require("./intervals/setStatus").interval;
setInterval(()=>{statusInterval(dClient);}, 15000);

dClient.on("message", (msg)=> {
    console.log("[EVENT:MESSAGE] Message recieved.".event);
    messageHandler({
        msg:msg,
        dClient:dClient,
        footer: false
    });
});
console.log("[BOOT] DONE Adding event listeners".success);

console.log("[BOOT] WORKING Init express server".working);
let express = require("express");
let app = express();
require("./api/server").init(app);
require("./modules/stats").init(dClient);
console.log("[BOOT] DONE Init express server".success);

console.log("[BOOT] WORKING Authenticating".working);
dClient.login(CONFIG.SECRETS.DISCORD.TOKEN).then(()=>{
    console.log("[BOOT] DONE Authenticating".success);
}); // Auth with the discord auth token


console.log("[BOOT] DONE".success);