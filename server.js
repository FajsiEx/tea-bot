/*

    Tea-bot
    © FajsiEx 2019
    Licensed under MIT license - see LICENSE.md for the full license text

*/

let startTimestamp = new Date().getTime();
require("./inits/consoleColors").init();

const discordJS = require('discord.js'); // Lib for interacting with the discord API
let CONFIG = require("./modules/config");

const messageHandler = require("./handlers/message").handler;

console.log("[BOOT] Modules loaded".success);

const Sentry = require('@sentry/node');
CONFIG.SENTRY.IS = require("./sentry/init").init();

console.log("[BOOT] Sentry initialized".success);

const dClient = new discordJS.Client(); // Construct a discord client object
console.log("[BOOT] Initialized Discord client".success);

let ready = false;

// Add event listeners
dClient.on("ready", ()=>{
    // Call intervals first time
    statusInterval(dClient);
    
    if (!ready) {
        console.log("________________________________________________________\n");
        console.log("「 Tea-bot Re:Write 」 Project".special);
        console.log(`Build ${CONFIG.BOT.BUILD_INFO.BUILD_STRING}`.warn);
        console.log("(c) FajsiEx 2019 - under MIT license\n");

        console.log("Website: https://tea-bot.ml/".debug);
        console.log("Github:  https://github.com/FajsiEx/tea-bot".debug);
        console.log("________________________________________________________\n");

        console.log(`Tea-bot ready. Delta start-ready: ${new Date().getTime() - startTimestamp}ms`.event);
        ready = true;
    }
});

// TODO: Add checks if the dclient is ready
let statusInterval = require("./intervals/setStatus").interval;
setInterval(()=>{statusInterval(dClient);}, 15000);
require('./intervals/autoUpdSticky').setup(dClient);

dClient.on("message", async (msg)=> {
    try {
        await messageHandler({
            msg:msg,
            dClient:dClient,
            footer: false
        });
    }catch(e){
        console.log(`[EVENT:MESSAGE] Got a reject: ${e}`.error);
        if(CONFIG.SENTRY.IS) Sentry.captureException(e);
        return;
    }
});

dClient.on("error", (err)=> {
    console.error(err);
});

console.log("[BOOT] Created event listeners".success);

let express = require("express");
let app = express();
require("./api/server").init(app, dClient);
require("./modules/stats").init(dClient);
console.log("[BOOT] Initialized express API server".success);

dClient.login(CONFIG.SECRETS.DISCORD.TOKEN).then(()=>{
    console.log("[BOOT] Logged in.".success);
}); // Auth with the discord auth token
