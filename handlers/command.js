const CONFIG = require("../modules/config");

const handleDataCheck = require("../checks/handleData").check;

const DEFAULT_COMMMANDS_PATH = "../commands/";
const COMMANDS = [
    {
        categoryName: "dev",
        commands: [
            {
                keywords: ["ping"],
                handler: require(DEFAULT_COMMMANDS_PATH + "ping").handler
            }
        ]
    },
    {
        categoryName: false, // Without prefix
        commands: [
            {
                keywords: ["hi", "hello", "konichiwa"],
                handler: require(DEFAULT_COMMMANDS_PATH + "hi").handler
            }
        ]
    },
];

module.exports = {
    handler: (handleData)=>{
        console.log("[HANDLER:COMMAND] INFO Called.");

        if (handleDataCheck(handleData)) {
            console.log("[HANDLER:COMMAND] ERR handleData check failed. Returning false.");
            return false;
        }
        
        let msg = handleData.msg; // Get msg from handle data
        let requestedCommandString = msg.content.split(CONFIG.DISCORD.PREFIXES[0])[1].toLowerCase(); // t!dEv:PiNg => dev:ping

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
        }else if (requestedCommandArray.length == 1) { // If the array has 1 element (command only)
            requestedCommandName = requestedCommandArray[0]; // Just use the 1st (and only) element in the array
        }else{ // No elements in the array ("t!"" will get an element in the array [""])
            // Houston we have a problem.
            console.log("[HANDLE:COMMAND] ERR No element in command array. Aborting.".error);
            return false;
        }

        let requestedCommandCategory = COMMANDS.filter(commandCategory => { // Now we get the command category from the category name (or the false category if none was defined)
            return commandCategory.categoryName == requestedCommandCategoryName;
        })[0];

        if (!requestedCommandCategory) {
            console.log(`[HANDLE:COMMAND] WARN Command category [${requestedCommandCategoryName}] does not exist.`.warn);
            msg.channel.send(CONFIG.MSGS.INVALID_COMMAND_CATEGORY);
            return;
        }

        let requestedCommand = requestedCommandCategory.commands.filter(command => { // Get command itself from the category by the command name entered.
            return command.keywords.indexOf(requestedCommandName) > -1;
        })[0];

        if (!requestedCommand) { // If no command was found
            console.log(`[HANDLE:COMMAND] WARN Command [${requestedCommandName}] does not exist.`.warn);
            msg.channel.send(CONFIG.MSGS.INVALID_COMMAND);
            return;
        }

        console.log(`[HANDLE:COMMAND] INFO Command [${requestedCommandName}]`.info);
        requestedCommand.handler(handleData);

    }
};