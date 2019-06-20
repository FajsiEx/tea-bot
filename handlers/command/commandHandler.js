/*

    Tea-bot
    © FajsiEx 2019
    Licensed under MIT license - see LICENSE.md for the full license text

    Module: command (handler)
    Desc: handles incoming msg which msgHandler judged to be a command and passes the control over to the specific command module - if found.

*/

const CONFIG = require("/modules/config");

const dbBridge = require("/db/bridge");
const permChecker = require("/modules/permChecker");
const restrictionChecker = require("/modules/restrictionChecker");

const handleDataCheck = require("/checks/handleData").check;

const COMMANDS = require("./commandData").getCommands();

module.exports = {
    /*
        Desc: Handler for message containing a prefix
        Input: handleData - handle data passed from msgHandler created from main on("msg") handler
        Output: bool[true=passed control over to the command module; false=any other action]
    */
    handler: async function (handleData, prefixUsed) {

        if (handleDataCheck(handleData)) { // Check your data, kids
            throw ("Failed handleData check");
        }

        // TODO: move this somewhere prob helper functions
        let msg = handleData.msg; // Get msg from handle data
        let requestedCommandString = msg.content.split(prefixUsed)[1].split(" ")[0].toLowerCase(); // t!dEv:PiNg => dev:ping

        /* 
            Splits command category and command itself to an array as follows:
            dev:ping => ["dev", "ping"] ([category, command]);
            hello => ["hello"] ([command])
        */
        let requestedCommandArray = requestedCommandString.split(":");

        let requestedCommandCategoryName = false; // string (if command category exists) / bool (false if the category wasn't specified)
        let requestedCommandName; // string (command name itself)

        // If the command array has a category and a command name (length:>=2) NOTE: We don't really care about elements other than the first 2.
        if (requestedCommandArray.length > 1) {
            requestedCommandCategoryName = requestedCommandArray[0]; // The first element in the array is the category name
            requestedCommandName = requestedCommandArray[1]; // and the second one is the command
        } else if (requestedCommandArray.length == 1) { // If the array has 1 element (command only)
            requestedCommandName = requestedCommandArray[0]; // Just use the 1st (and only) element in the array
        } else { // No elements in the array ("t!"" will get an element in the array [""])
            // Houston we have a problem.
            console.log("[HANDLE:COMMAND] No element in command array. Aborting. This should not happen. ever.".error);
            throw ("Empty requestedCommandArray");
        }

        let requestedCommandCategory = COMMANDS.filter(commandCategory => { // Now we get the command category from the category name (or the false category if none was defined)
            return commandCategory.categoryName == requestedCommandCategoryName;
        })[0];

        if (!requestedCommandCategory) { // If the command category for the requested command isn't found
            let invalidCommandCategory = COMMANDS.filter(commandCategory => { // Get the invalid cat
                return commandCategory.categoryName == "invalid";
            })[0];
            let invalidCommandCategoryCommand = invalidCommandCategory.commands.filter(command => { // and get invalid:category "command" from it
                return command.keywords.indexOf("category") > -1;
            })[0];

            invalidCommandCategoryCommand.handler(handleData); // Call it

            return 2; // 2 = category not found
        }

        let requestedCommand = requestedCommandCategory.commands.filter(command => { // Get command itself from the category by the command name entered.
            return command.keywords.indexOf(requestedCommandName) > -1;
        })[0];

        if (!requestedCommand) { // If no command was found in it's category
            let invalidCommandCategory = COMMANDS.filter(commandCategory => { // Get the invalid cat
                return commandCategory.categoryName == "invalid";
            })[0];
            let invalidCommandCommand = invalidCommandCategory.commands.filter(command => { // and get invalid:command "command" from it
                return command.keywords.indexOf("command") > -1;
            })[0];

            invalidCommandCommand.handler(handleData); // Call it

            return 1; // 1 = command not found
        }

        if (requestedCommand.rights) { // If the command has any rights
            if (requestedCommand.rights.adminOnly) {
                let isAdmin = await permChecker.admin(handleData);
                if (!isAdmin) {
                    msg.channel.send({
                        "embed": {
                            "title": "Nope",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": `
                                You don't have the MANAGE_GUILD permission. Oops.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    }).then((botMsg) => {
                        botMsg.delete(15000);
                    });

                    return 3; // 3 = does not have admin rights
                }
            } else if (requestedCommand.rights.devOnly) { // If the command is dev only,
                let isDev = await permChecker.dev(handleData.msg.author.id);
                if (!isDev) { // and the caller is not me,
                    // Basically fake invalid command so no one sees anything

                    let invalidCommandCategory = COMMANDS.filter(commandCategory => {
                        return commandCategory.categoryName == "invalid";
                    })[0];
                    let invalidCommandCommand = invalidCommandCategory.commands.filter(command => {
                        return command.keywords.indexOf("command") > -1;
                    })[0];

                    invalidCommandCommand.handler(handleData);

                    return 4; // 4 = is not dev
                }
            }
        }

        if (requestedCommand.requirements) {

            if (requestedCommand.requirements.readyDatabase) { // If the command requires db to be ready

                if (!dbBridge.isDBReady()) { // If db isn't ready
                    try {
                        module.exports.responses.dbNotReadyResponse(handleData);
                    } catch (e) {
                        console.log(`Failed to send db not ready message: ${e}`);
                    }
                    return 5;
                }

            }
            
            if (requestedCommand.requirements.channelType) {
                if (msg.channel.type != requestedCommand.requirements.channelType) {
                    msg.channel.send({
                        "embed": {
                            "title": "Nope",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": `
                                That command works only in ${requestedCommand.requirements.channelType} channels. sry.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    }).then((botMsg) => {
                        botMsg.delete(15000);
                    });

                    return 5; // Command which requires text channel used in non-text channel
                }
            }
        }

        // Add usedCommand to handleData
        handleData.usedCommand = requestedCommandName;

        if (msg.channel.type == "text") { // If the request was made in a guild text channel only (no DMs cause they don't have guildId to check the restrict against)
            // Check if the user has some restriction on him/her/it
            let isPermitted;
            try {
                isPermitted = await restrictionChecker.checkRestrictions(handleData);
            } catch (e) {
                throw ("CheckRestriction rejected: " + e);
            }

            // If yes (is not permitted)
            if (!isPermitted) { // Delete the message and go away
                try {
                    await msg.delete();
                }catch(e){
                    console.log(`Failed to delete restricted message: ${e}`.warn);
                }
                return 20;
            }
        }

        msg.channel.startTyping();
        // Call the command
        try {
            await requestedCommand.handler(handleData);
        } catch (e) {
            try {
                module.exports.responses.internalError(handleData, e, requestedCommandCategoryName, requestedCommandName);
            } catch (e) {
                console.log(`Failed to send internal reject error message: ${e}`.error);
            }
            msg.channel.stopTyping();
            throw (`Command [${requestedCommandName}] rejected: ${e}`);
        }

        msg.channel.stopTyping();
        return 0; // 0 = command executed successfully
    }, // End of handler

    responses: {
        dbNotReadyResponse: async function (handleData) {
            try {
                await handleData.msg.channel.send({
                    "embed": {
                        "title": "This command is currently unavailable",
                        "color": CONFIG.EMBED.COLORS.WARN,
                        "description": `
                            Due to temporary database outage, I cannot run this command. Please try again later.
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                });
            } catch (e) {
                throw ("Failed to send db not ready message: " + e);
            }
        },

        internalError: async function (handleData, e, requestedCommandCategoryName, requestedCommandName) {
            try {
                if (!requestedCommandCategoryName) {
                    requestedCommandCategoryName = ""; // If requestedCommandCategoryName is undefined, we set it to empty string so it doesn't look weird.
                } else {
                    requestedCommandCategoryName += ":"; // If it does exist, add : to it so it looks nice in the message
                }
                await handleData.msg.channel.send({
                    "embed": {
                        "title": "Error | Command error",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                            While processing the \`!${requestedCommandCategoryName}${requestedCommandName}\` command an error has occurred.
                            Don't worry, this error will be reported to Sentry in a couple of seconds.
                            If you feel like it, you should report this bug [here](https://github.com/FajsiEx/tea-bot/issues/new) with as much info as possible.

                            **Technical details:**
                            Command handler has received a reject from the command module.

                            *Handle id:* **${handleData.id}**
                            *Reject trace:* ${e}
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                });
            } catch (e) {
                throw ("Failed to send internal reject error message: " + e);
            }
        }
    }
};