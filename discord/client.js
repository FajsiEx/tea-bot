
const discordJS = require('discord.js'); // Lib for interacting with the discord API
const dClient = new discordJS.Client(); // Construct a discord client object

const Sentry = require('@sentry/node');

let CONFIG = require("/modules/config");

const messageHandler = require("../handlers/message/messageHandler").handler;
const discordClientErrorHandler = require("/handlers/clientError/errorHandler").handler;
const statusInterval = require("/intervals/setStatus").interval;

const messageEventDataClass = require("/classes/messageEventData");

let ready = false; // Initial ready - won't trigger things made to run only once on ready

module.exports = {
    init: function () {
        
        require('/intervals/setStatus').setup(dClient);
        require('/intervals/autoUpdSticky').setup(dClient);
        
        // Add event listeners
        dClient.on("ready", () => {
            if (!ready) {
                console.log("________________________________________________________\n");
                console.log("「 Tea-bot Re:Write 」 Project".special);
                console.log(`Build ${CONFIG.BOT.BUILD_INFO.BUILD_STRING}`.warn);
                console.log("(c) FajsiEx 2019 - under MIT license\n");

                console.log("Website: https://tea-bot.ml/".debug);
                console.log("Github:  https://github.com/FajsiEx/tea-bot".debug);
                console.log("________________________________________________________\n");

                console.log(`Tea-bot ready! Current server time: ${new Date().toString()}`.event);
                ready = true;
            }
        });

        dClient.on("message", async (msg) => {
            let messageEventData = new messageEventDataClass(dClient, msg, false);

            try {
                await messageHandler(messageEventData);
            } catch (e) {
                console.log(`[EVENT:MESSAGE] [${messageEventData.id}] Got a reject: ${e}`.error);
                if (CONFIG.SENTRY.IS) Sentry.captureException(new Error(e));
                return;
            }
        });

        dClient.on("error", discordClientErrorHandler);

        console.log("[DISCORD] Created event listeners".success);
    },

    getDiscordClient: function() {
        return dClient;
    }
};