/*

    Handles onmessage event of the discordClient

*/

const jffModule = require("./jffModule");
const globalVariables = require("./globalVariables");
const botCommands = require("./botCommands");

const CONSTS = require("./consts");
const COLORS = require("./consts").COLORS;
const OWO_DM_REPLY_MSGS = require("./consts").OWO_DM_REPLY_MSGS;

const discordBotConfig = require("./consts").discordBotConfig;

const NPERMIT_WARNING_MSG = {
    "embed": {
        "title": "Warning!",
        "color": COLORS.YELLOW,
        "description": `
            Messages outside of bot category channels or DMs will be deleted after 5 minutes.
        `
    }
};

const NPERMIT_WARNING_TIMEOUT = 1 * 5 * 1000; // 5 minutes * 60 seconds * 1000ms

let warnedAboutNPchan = {}; // Stores if the warning was already sent to a channel (<int>chanId: <bool>wasSent)

module.exports = (msg, discordClient)=>{
    let usersObj = globalVariables.get("usersObj");
    let events = globalVariables.get("events");

    if (msg.author.bot || (msg.content.startsWith(CONSTS.discordBotConfig.prefix) || msg.channel.type == 'text')) { // We check if the author of the message isn't a bot or op with msg with ! prefix
        if (msg.channel.type == 'text' && msg.author.id == discordClient.user.id) { // If the origin  of the msg is from a text channel and is from tea-bot
            let chan_permitted = false;

            if (msg.channel.parent) {
                console.log(`[BOT_COMMANDS] CHAN_CATEGORY ${msg.channel.parent.name}`);
                if(msg.channel.parent.name == "bot") {
                    chan_permitted = true;
                }
            }

            console.log(`[BOT_MSG_REC] CHAN_PER:${chan_permitted}; CONTENT:${msg.content}`);

            if (!chan_permitted) { // Chan will be permited only when the msg is in a text chan & is in bot category
                if (!warnedAboutNPchan[msg.channel.id]) {
                    warnedAboutNPchan[msg.channel.id] = true;
                    msg.channel.send(NPERMIT_WARNING_MSG);
                    setTimeout(()=>{
                        warnedAboutNPchan[msg.channel.id] = false;
                    }, NPERMIT_WARNING_TIMEOUT);
                }
                setTimeout(()=>{
                    msg.delete().catch((e)=>{console.log("[CH_NP_MSGDELETE] Failed to delete bot msg".error); console.log(e);});
                }, NPERMIT_WARNING_TIMEOUT);
                
            }
            return;
        }
        console.log("[MSG_HANDLER] REJECTED: Bot message has been ignored.".warn);
        return; // If they are, we just ignore them.
    }

    if (!msg.channel) { // Because the bot uses the msg.channel.send function to reply in most cases we check if that channel exists
        console.log("[MSG_HANDLER] REJECTED: No message channel object".warn);
        msg.reply({
            "embed": {
                "title": "Prosím napíšte mi do nejakého kanálu alebo DM.",
                "color": COLORS.RED
            }
        });
        return;
    }

    // Get some shit from the msg object
    let author_id = msg.author.id; // Discord user ID of the author user
    let author = msg.author.username + "#" + msg.author.discriminator; // User#1337
    let message = msg.content; // Actual content of the message
    if(!usersObj[author_id]) {
        usersObj[author_id] = {
            username: author,
            mpm: 1, // Messages per minute [LEGACY]
            timeOfFirstMinuteMessage: 0, // [LEGACY]
            warned: 0, // And increment their timeout [LEGACY]
            timeout: 0, // And set their timeout [LEGACY]
            commandTimeout: 0, // And set their command timeout
            alreadyReportedTimeout: 0, // 0=not reported yet. [LEGACY]
            alreadyWishedGN: 0, // 0=not wished GN yet. [LEGACY]
            muteTimeout: 0, // 0=not timeouted.
            agreedWarning: false // Agreed? Better not.
        };
        globalVariables.set("usersObj", usersObj);
    }
    
    // Good night wishing thing
    jffModule.goodNightWisher(msg, author_id, discordClient);

    // Various easter eggs
    jffModule.msgEaterEggReply(msg, message);

    // OwO what's this (may have God mercy on this world)
    if(jffModule.owoReplier(msg, discordClient)) {
        sendDM = (Math.round(Math.random() * 5) == 3);
        if (sendDM) {
            let DMMsg = OWO_DM_REPLY_MSGS[Math.floor(Math.random() * OWO_DM_REPLY_MSGS.length + 1)-1]; // Gets a random msg from the array (SB baka lol)
            msg.author.send(DMMsg); // And finally sends it as an DM (hopeflly ;])
        }
        return;
    }
    // Success.

    // Detect if the message is a bot command
    if (message.startsWith(discordBotConfig.prefix)) { // If the message starts with !, take it as a command
        console.log(`[MSG_HANDLER] COMMAND: Passing message to botCommand handler.`);
        botCommands.handleBotCommand(msg, discordClient);
        return;
    }

    console.log(`[MSG_HANDLER] SAVE: Saving global vars. We're done here.`);
    globalVariables.set("usersObj", usersObj);
    globalVariables.set("events", events);
};