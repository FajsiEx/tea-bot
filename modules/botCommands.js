
const stringSimilarity = require('string-similarity');

const CONSTS = require("./consts");
const COLORS = require("./consts").COLORS;
const globalVariables = require("./globalVariables");
const smallFunctions = require("./smallFunctions");
const mathHandler = require("./mathHandler");

const ping = require("./commands/dev/ping");
const send = require("./commands/dev/send");
const st = require("./commands/dev/st");
const testread = require("./commands/dev/testread");
const testpp = require("./commands/dev/testpp");
const snap = require("./commands/dev/snap");
const sd = require("./commands/dev/sd");
const forceload = require("./commands/dev/forceload");
const forcesave = require("./commands/dev/forcesave");
const forceinit = require("./commands/dev/forceinit");
const setOsuMember = require("./commands/dev/setosumember");

const mute = require("./commands/mod/mute");
const unmute = require("./commands/mod/unmute");
const nuke = require("./commands/mod/nuke");
const mod = require("./commands/mod/mod");

const help = require("./commands/info/help");
const faq = require("./commands/info/faq");

const countdowns = require("./commands/events/countdowns");
const sub = require("./commands/events/sub");
const addEvent = require("./commands/events/add");
const events = require("./commands/events/events");
const deleteEvent = require("./commands/events/delete");
const editEvent = require("./commands/events/edit");

const makeDP = require("./commands/events/dp/makedp");
const voteDP = require("./commands/events/dp/votedp");
const statDP = require("./commands/events/dp/statdp");
const clearDP = require("./commands/events/dp/cleardp");

const spravnyprikaz = require("./commands/jff/spravnyprikaz");
const tea = require("./commands/jff/tea");
const gtg = require("./commands/jff/gtg");
const skap = require("./commands/jff/skap");
const rip = require("./commands/jff/rip");
const ahoj = require("./commands/jff/ahoj");
const zhni = require("./commands/jff/zhni");
const joke = require("./commands/jff/joke");
const kill = require("./commands/jff/kill");
const alecau = require("./commands/jff/alecau");
const nick = require("./commands/jff/nick");
const kawaii = require("./commands/jff/kawaii");
const pvt = require("./commands/jff/pvt");
const weather = require("./commands/jff/weather");
const thanks = require("./commands/jff/thanks");
const wfbo = require("./commands/jff/wfbo");
const crabrave = require("./commands/jff/crabrave");
const fuckea = require("./commands/jff/fuckea");
const sleep = require("./commands/jff/sleep");
const cya = require("./commands/jff/cya");

const roll = require("./commands/random/roll");
const tf = require("./commands/random/tf");

const technokitty = require("./commands/lyrics/technokitty");
const united = require("./commands/lyrics/united");
const raveboy = require("./commands/lyrics/raveboy");
const mtc = require("./commands/lyrics/mtc");

const meme = require("./commands/jff/meme");
const meirl = require("./commands/jff/meirl");
const kubko = require("./commands/jff/kubko"); // A.K.A the hentai command
const admeme = require("./commands/jff/admeme"); // A.K.A Dan's command

const play = require("./commands/music/play");
const stop = require("./commands/music/stop");
const skip = require("./commands/music/skip");
const queue = require("./commands/music/queue");

const owo = require("./commands/ffiy/owo");
const uwu = require("./commands/ffiy/uwu");
const r34 = require("./commands/ffiy/r34");
const e621 = require("./commands/ffiy/e621");
const e926 = require("./commands/ffiy/e926");
const agree = require("./commands/ffiy/agree");

// TODO: Move this to another module lol
let commands = {
    // Dev commands
    'ping': (msg)=>{ping.command(msg);},

    'send': (msg, discordClient)=>{send.command(msg, discordClient);},

    'st': (msg)=>{st.command(msg);},

    'dtr': (msg)=>{testread.command(msg);},
    'testread': (msg)=>{testread.command(msg);},

    'dtp': (msg)=>{testpp.command(msg);},
    'testpp': (msg)=>{testpp.command(msg);},

    'snap': (msg)=>{snap.command(msg);},

    'sd': (msg, discordClient)=>{sd.command(msg, discordClient);},

    'forceload': (msg)=>{forceload.command(msg);},
    'fl': (msg)=>{forceload.command(msg);},

    'forcesave': (msg)=>{forcesave.command(msg);},
    'fs': (msg)=>{forcesave.command(msg);},

    'forceinit': (msg)=>{forceinit.command(msg);},
    'fi': (msg)=>{forceinit.command(msg);},

    'sosum': (msg)=>{setOsuMember.command(msg);},
    

    // Mod commands
    'mute': (msg)=>{mute.command(msg);},
    'silence': (msg)=>{mute.command(msg);},

    'unmute': (msg)=>{unmute.command(msg);},
    'unsilence': (msg)=>{unmute.command(msg);},

    'nuke': (msg)=>{nuke.command(msg);},

    'mod': (msg)=>{mod.command(msg);},

    // Info commands
    'h': (msg)=>{help.command(msg);},
    'help': (msg)=>{help.command(msg);},
    'pomoc': (msg)=>{help.command(msg);},
    'prikazy': (msg)=>{help.command(msg);},

    'faq': (msg)=>{faq.command(msg);},

    // Event commands
    'ho': (msg)=>{countdowns.command(msg);},
    'holidays': (msg)=>{countdowns.command(msg);},
    'prazdniny': (msg)=>{countdowns.command(msg);},
    'cd': (msg)=>{countdowns.command(msg);},
    'countdowns': (msg)=>{countdowns.command(msg);},

    'add': (msg)=>{addEvent.command(msg);},
    'pridat': (msg)=>{addEvent.command(msg);},

    'ev': (msg)=>{events.command(msg);},
    'events': (msg)=>{events.command(msg);},
    'eventy': (msg)=>{events.command(msg);},

    'dnes': (msg)=>{events.command(msg, "dnes");},
    'today': (msg)=>{events.command(msg, "dnes");},
    'zajtra': (msg)=>{events.command(msg, "zajtra");},
    'tomorrow': (msg)=>{events.command(msg, "zajtra");},
    'tyzden': (msg)=>{events.command(msg, "week");},
    'week': (msg)=>{events.command(msg, "week");},

    'edit': (msg)=>{editEvent.command(msg);},

    'del': (msg)=>{deleteEvent.command(msg);},
    'delete': (msg)=>{deleteEvent.command(msg);},
    'vymazat': (msg)=>{deleteEvent.command(msg);},

    'sub': (msg)=>{sub.command(msg);},

    // DP
    'makedp': (msg)=>{makeDP.command(msg);},

    'dp': (msg)=>{voteDP.command(msg);},
    'votedp': (msg)=>{voteDP.command(msg);}, // /!\ LEGACY

    'statdp': (msg, discordClient)=>{statDP.command(msg, discordClient);},
    'listdp': (msg, discordClient)=>{statDP.command(msg, discordClient);},

    'cleardp': (msg)=>{clearDP.command(msg);},
    'deletedp': (msg)=>{clearDP.command(msg);},
    'removedp': (msg)=>{clearDP.command(msg);},

    // Random commands
    'spravnyprikaz': (msg)=>{spravnyprikaz.command(msg);},

    'gtg': (msg)=>{gtg.command(msg);},

    'tea': (msg)=>{tea.command(msg);},

    'skap': (msg)=>{skap.command(msg);},
    'umri': (msg)=>{skap.command(msg);},

    'rip': (msg)=>{rip.command(msg);},

    'ahoj': (msg)=>{ahoj.command(msg);},

    'ea': (msg)=>{fuckea.command(msg);},
    'fuckea': (msg)=>{fuckea.command(msg);},

    'gn': (msg)=>{sleep.command(msg);},
    'sleep': (msg)=>{sleep.command(msg);},

    'zhni': (msg)=>{zhni.command(msg);},

    'wfbo': (msg)=>{wfbo.command(msg);},
    'weirdflexbutok': (msg)=>{wfbo.command(msg);},

    'crabrave': (msg)=>{crabrave.command(msg);},
    'ravecrab': (msg)=>{crabrave.command(msg);},

    'joke': (msg)=>{joke.command(msg);},
    'vtip': (msg)=>{joke.command(msg);},
    'haha': (msg)=>{joke.command(msg);},

    'kill': (msg)=>{kill.command(msg);},
    'zabi': (msg)=>{kill.command(msg);},

    'cya': (msg)=>{cya.command(msg);},

    'alecau': (msg)=>{alecau.command(msg);},

    'nick': (msg, discordClient)=>{nick.command(msg, discordClient);},
    'name': (msg, discordClient)=>{nick.command(msg, discordClient);},

    'kawaii': (msg)=>{kawaii.command(msg);},
    'kw': (msg)=>{kawaii.command(msg);},

    'pvt': (msg)=>{pvt.command(msg);},

    'weather': (msg)=>{weather.command(msg);},
    'pocasie': (msg)=>{weather.command(msg);},

    'thanks': (msg)=>{thanks.command(msg);},
    'thx': (msg)=>{thanks.command(msg);},
    'dakujem': (msg)=>{thanks.command(msg);},
    'diki': (msg)=>{thanks.command(msg);},
    'dik': (msg)=>{thanks.command(msg);},

    // Music
    'play': (msg)=>{play.command(msg);},
    'hraj': (msg)=>{play.command(msg);},

    'stop': (msg)=>{stop.command(msg);},

    'skip': (msg)=>{skip.command(msg);},

    'queue': (msg)=>{queue.command(msg);},
    'mq': (msg)=>{queue.command(msg);},
    'rada': (msg)=>{queue.command(msg);},

    // Roll
    'roll': (msg)=>{roll.command(msg);},

    'tf': (msg)=>{tf.command(msg);},

    // >_<
    'owo': (msg)=>{owo.command(msg);},

    'uwu': (msg)=>{uwu.command(msg);},

    'r34': (msg)=>{r34.command(msg);},

    'e621': (msg)=>{e621.command(msg);},
    'hell': (msg)=>{e621.command(msg);},

    'e926': (msg)=>{e926.command(msg);},

    'agree': (msg)=>{agree.command(msg);},

    // Lyrics
    'technokitty': (msg)=>{technokitty.command(msg);},
    'tk': (msg)=>{technokitty.command(msg);},

    'united': (msg)=>{united.command(msg);},

    "raveboy": (msg)=>{raveboy.command(msg);},

    "mtc": (msg)=>{mtc.command(msg);},

    // Memes
    'meme': (msg)=>{meirl.command(msg);},
    'meirl': (msg)=>{meirl.command(msg);},

    'kubko': (msg)=>{kubko.command(msg);},
    'hentai': (msg)=>{kubko.command(msg);},

    'admeme':(msg)=>{admeme.command(msg);},

    'excuse': (msg)=>{meme.command(msg, "excuse");},
    'excuseme': (msg)=>{meme.command(msg, "excuse");},
    'excusemewtf': (msg)=>{meme.command(msg, "excuse");},
    'wtf': (msg)=>{meme.command(msg, "excuse");},

    'tmyk': (msg)=>{meme.command(msg, "tmyk");},
    'themoreyouknow': (msg)=>{meme.command(msg, "tmyk");},

    'commit': (msg)=>{meme.command(msg, "commit");},
    'gocommit': (msg)=>{meme.command(msg, "commit");},

    'circles': (msg)=>{meme.command(msg, "circles");},

    'qi': (msg)=>{meme.command(msg, "qi");},
    '400qi': (msg)=>{meme.command(msg, "qi");},

    'really': (msg)=>{meme.command(msg, "nigga");},
    'nigga': (msg)=>{meme.command(msg, "nigga");},

    'cheese': (msg)=>{meme.command(msg, "cheese");},

    'oof': (msg)=>{meme.command(msg, "oof");},

    'doit': (msg)=>{meme.command(msg, "doit");},

    'facepalm': (msg)=>{meme.command(msg, "facepalm");},

    'forehead': (msg)=>{meme.command(msg, "forehead");},

    'flashbang': (msg)=>{meme.command(msg, "flashbang");},

    'way': (msg)=>{meme.command(msg, "way");},

    'pika': (msg)=>{meme.command(msg, "pika");},

    'tsj': (msg)=>{meme.command(msg, "tsj");},

    'killmeme': (msg)=>{meme.command(msg, "killmeme");},
    'memereview': (msg)=>{meme.command(msg, "killmeme");},

    'yeet': (msg)=>{meme.command(msg, "yeet");},

    'monkas': (msg)=>{meme.command(msg, "monkas");},

    'monkaomega': (msg)=>{meme.command(msg, "monkaomega");},

    'monkagiga': (msg)=>{meme.command(msg, "monkagiga");},

    'wwtf': (msg)=>{meme.command(msg, "wwtf");},

    'whid': (msg)=>{meme.command(msg, "whid");},
    'whathaveidone': (msg)=>{meme.command(msg, "whid");},

    'gj': (msg)=>{meme.command(msg, "gj");},
    'greatjob': (msg)=>{meme.command(msg, "gj");},

    'booty': (msg)=>{meme.command(msg, "booty");},

    'ooth': (msg)=>{meme.command(msg, "ooth");},

    'kappa': (msg)=>{meme.command(msg, "kappa");},

    'speech': (msg)=>{meme.command(msg, "speech");},

    'lookatthisdude': (msg)=>{meme.command(msg, "lookatthisdude");},
    'look': (msg)=>{meme.command(msg, "lookatthisdude");},

    'holdup': (msg)=>{meme.command(msg, "holdup");},
    'holdhore': (msg)=>{meme.command(msg, "holdup");},
    'drzup': (msg)=>{meme.command(msg, "holdup");},
    'drzhore': (msg)=>{meme.command(msg, "holdup");},
    'holehore': (msg)=>{meme.command(msg, "holdup");},

    'ohfuck': (msg)=>{meme.command(msg, "ohfuck");},

    'butwhy': (msg)=>{meme.command(msg, "ycdtbw");},
    'ycdtbw': (msg)=>{meme.command(msg, "ycdtbw");},
    'youcoulddothatbutwhy': (msg)=>{meme.command(msg, "ycdtbw");},

    'bye': (msg)=>{meme.command(msg, "bye");},
    'cau': (msg)=>{meme.command(msg, "bye");}
};

const COMMANDS_ARRAY = Object.keys(commands); // let me be array, please

const NSFW_COMMANDS = [
    "r34",
    "e621",
    "hell",
    "kubko",
    "hentai"
];

const DEV_COMMANDS = [
    "send",
    "testread",
    "dtr",
    "testpp",
    "dtp",
    "snap",
    "sd",
    "forceload",
    "fl",
    "forcesave",
    "fs",
    "forceinit",
    "fi"
];
const ADMIN_COMMANDS = [
    "mute",
    "silence",
    "unmute",
    "unsilence",
    "nuke",
    "mod",
    "makedp",
    "cleardp",
    "deletedp",
    "removedp"
];

module.exports = {
    handleBotCommand: (msg, discordClient)=>{
        console.log(`[BOT_COMMANDS] HANDLER: Called. Processing the msg...`);

        let commandMessageArray = msg.content.split(" "); // Split words of the message into an array

        let command = commandMessageArray[0].slice(1); // Extracts the command from the message
        command = command.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Get rid of shit in Slovak lang
        command = command.toLocaleLowerCase(); // Ignore the case by converting it to lower

        if (NSFW_COMMANDS.indexOf(command) != -1 && msg.channel.type == 'text') { // If the command is in the NSFW array AND the chan is text-chan
            if (!msg.channel.nsfw) { // If the chan is not marked as NSFW
                msg.channel.send({
                    "embed": {
                        "title": "Tento príkaz sa môže vykonávať len v NSFW kanáloch alebo v group DM a DMkách.",
                        "color": COLORS.RED
                    }
                }).then((responseMsg)=>{
                    msg.delete(); // Deletes the user's message
                    responseMsg.delete(5000); // and deletes this msg after 5 seconds
                });
                return; // Don't continue
            }
        }
        
        let modModeOn = globalVariables.get("modModeOn");

        if (modModeOn) { // If the bot is in modderated mode,
            if (!smallFunctions.checkAdmin(msg)) { // Check if the author is dev
                console.log(`[BOT_COMMANDS] REJECTED: Bot is in mod mode.`);
                return;
            }
        }

        console.log(`[BOT_COMMANDS] HANDLER: Done with basic processing of the msg. Calling mathHandler to check...`);

        if (mathHandler.processCommand(msg)) {return;} // This will check if the command is a math command and if it is, it will process and reply to it and return true;

        console.log(`[BOT_COMMANDS] HANDLER: All the shit out of the way. Checking with object literals...`);

        if (commands[command]) { // If the command is found in the commands object
            console.log(`[BOT_COMMANDS] PASS: Command found in the object. Passing control to the actual command module. Done here.`);
            
            // Increments and stores the number of commands served
            let commsServed = globalVariables.get("commandsServed");
            commsServed++;
            globalVariables.set("commandsServed", commsServed);

            // Finally calls the command
            try {
                if (DEV_COMMANDS.indexOf(command) > -1) {
                    if (msg.author.id != DEV_USERID) {
                        msg.channel.send({
                            "embed": {
                                "title": "Dev only.",
                                "color": COLORS.RED
                            }
                        });
                        return;
                    }
                }
                if (ADMIN_COMMANDS.indexOf(command) > -1) {
                    if (!smallFunctions.checkAdmin(msg)) {
                        msg.channel.send({
                            "embed": {
                                "title": "Admin only.",
                                "color": COLORS.RED
                            }
                        });
                        return;
                    }
                }

                commands[command](msg, discordClient);
            }catch(e){
                // Log error
                console.error("[ERR] Command error on command " + command);
                console.error(e);

                let debugInfo = `
                    **Error &  Call stack:**
                    ${e.stack.split("\n")[0]}
                    ${e.stack.split("\n")[1]}
                    ${e.stack.split("\n")[2]}
                    ${e.stack.split("\n")[3]}
                `;

                // Report the error to the user
                msg.channel.send({
                    "embed": {
                        "title": "Ale do piči...",
                        "description": `
                            Necrashol som...ale nepodarilo sa mi vykonať príkaz **!${command}** >_< *nyaa...*
                            No nič no... poslal som error log developerovi a teraz len čakaj v priemere 3 roky kým sa to opraví.
                            To by bolo všetko.
                            ${debugInfo}
                        `,
                        "color": COLORS.RED
                    }
                });

                // Report the error to the dev
                discordClient.fetchUser(CONSTS.DEV_USERID).then((user)=>{
                    user.send({
                        "embed": {
                            "title": "Error",
                            "description": `
                                An error occurred while processing **!${command}** command.
                                Check the logs for moar details.
                                ${debugInfo}
                            `,
                            "color": COLORS.RED
                        }
                    });
                });
            }
            
        }else{
            console.log(`[BOT_COMMANDS] HANDLER: Command not found in object. Replying and we're done.`);

            let mostSimilarCommand = false;
            let mostSimilarCommandSimilarity = 0;

            COMMANDS_ARRAY.forEach((e)=>{
                similarity = stringSimilarity.compareTwoStrings(e, command);
                if (similarity > 0.25 && similarity > mostSimilarCommandSimilarity) { // Compares the entered command to every known command
                    mostSimilarCommandSimilarity = similarity; // If it is similar enough to an existing command and it is more similar than prev commands, store it.
                    mostSimilarCommand = e;
                }
            });

            let similarityMsg = "";
            if (mostSimilarCommand) {
                similarityMsg = `Možno si myslel **!${mostSimilarCommand}**? idk.`;
            }

            msg.channel.send({
                "embed": {
                    "title": "Nesprávny príkaz",
                    "color": COLORS.RED,
                    "description": `!${command} je niečo ako správny príkaz, ale nie. ${similarityMsg}\nPre list príkazov **!help**`,
                    "footer": {
                        "text": "Pôvodne som si myslel že to je meme pre všetkých, ako za starého dobrého komunizmu. Ale mílil som sa. Článok 13 Európskej únie mi prikazuje creditovat autora tohto memu (Davida Magyerku) od ktorého som tento meme bezočividne ukradol. Týmto by som sa chcel osobne a úprimne ospravedlniť Davidovi Magyerkovi za moju sebeckosť a idiotskosť pri používaní tohto memu bez jeho autorskeho súhlasu. Ďakujem. #saveTheInternet #article13"
                    }
                }
            });
        }

    }
};