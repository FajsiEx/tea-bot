const CONFIG = require("../modules/config");

const handleDataCheck = require("../checks/handleData").check;

const DEFAULT_COMMMANDS_PATH = "../commands/";

// Just add command™
let COMMANDS = [
    {
        categoryName: "dev",
        commands: [
            {
                keywords: ["ping"],
                handler: require(DEFAULT_COMMMANDS_PATH + "ping").handler,
            },
            {
                keywords: ["shutdown"],
                handler: require(DEFAULT_COMMMANDS_PATH + "dev/shutdown").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                }
            },
            {
                keywords: ["dbggd"],
                handler: require(DEFAULT_COMMMANDS_PATH + "dev/db/ggd").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                }
            },
            {
                keywords: ["deletegd"],
                handler: require(DEFAULT_COMMMANDS_PATH + "dev/db/deletegd").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                }
            },
            {
                keywords: ["testread"],
                handler: require(DEFAULT_COMMMANDS_PATH + "dev/db/testread").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                }
            },
            {
                keywords: ["testwrite"],
                handler: require(DEFAULT_COMMMANDS_PATH + "dev/db/testwrite").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                }
            }
        ]
    },

    {
        categoryName: "cpp",
        commands: [
            {
                keywords: ["congrats", "congratulations"],
                handler: require(DEFAULT_COMMMANDS_PATH + "copypaste/congrats").handler,
            }
        ]
    },

    {
        categoryName: "invalid", // Invalid command/category replies
        commands: [
            {
                keywords: ["category"],
                handler: require(DEFAULT_COMMMANDS_PATH + "invalid/category").handler,
            },
            {
                keywords: ["command"],
                handler: require(DEFAULT_COMMMANDS_PATH + "invalid/command").handler,
            }
        ]
    },
    
    {
        categoryName: false, // Without prefix
        commands: [
            {
                keywords: ["hi", "hello", "konichiwa"],
                handler: require(DEFAULT_COMMMANDS_PATH + "hi").handler,
            },
            {
                keywords: ["help", "tasukete"],
                handler: require(DEFAULT_COMMMANDS_PATH + "help").handler,
            },
        ]
    },
];

// Beware. Bellow this line lies madness.

// Move all command that don't have a name in >1 categoty to cat without prefix
let noprefixCommandCategory = COMMANDS.filter(commandCategory => {
    return commandCategory.categoryName == false;
})[0];

// Now we merge all commands into one array
let allCommands = [];
let allCommandNames = [];
COMMANDS.forEach((commandCategory)=>{
    if (!commandCategory.categoryName) {return;} // We don't want to include the commands without prefix
    if (commandCategory.categoryName == "invalid") {return;} // We wanna filter out the invalid category (only for replying when user enters an invalid smth)

    commandCategory.commands.forEach((command)=>{ // For every command in the category
        allCommands = allCommands.concat(command); // We add it to allCommands array
        allCommandNames = allCommandNames.concat(command.keywords); // And it's keywords to allCommandNames array
    });
});
console.log("[HANDLER:COMMAND] DEBUG init dump of all commands".debug);
console.log(allCommands);
console.log(allCommandNames);

// Now we detect duplicates
let duplicateCommandNames = [];
let c = [];
allCommandNames.forEach((commandName)=>{
    if (c.indexOf(commandName) > -1) {
        if (duplicateCommandNames.indexOf(commandName) < 0) {
            duplicateCommandNames.push(commandName);
        }
    }else{
        c.push(commandName);
    }
});
console.log("[HANDLER:COMMAND] DEBUG init dump of command name dups".debug);
console.log(duplicateCommandNames);

let nonDuplicateCommands = allCommands.filter((command)=> {
    let hasDuplicateKayword = false;
    if (command.cannotBeUsedWithoutCommandCategory) {return false;}
    command.keywords.forEach((keyword)=>{
        if (duplicateCommandNames.indexOf(keyword) > -1) {
            hasDuplicateKayword = true;
        }
    });
    return !hasDuplicateKayword;
});
console.log("[HANDLER:COMMAND] DEBUG init non duped commands".debug);
console.log(nonDuplicateCommands);

let withoutPrefixCommandCategory = COMMANDS.filter((commandCategory) => { // Get the "without prefix" category
    return commandCategory.categoryName == false;
})[0];
let commandsWithoutWithoutPrefixCommandCategory = COMMANDS.filter((commandCategory) => { // And get all command categories EXCEPT the "without prefix" category
    return commandCategory.categoryName != false;
});

// We merge commands from nonDuplicateCommands and commands wothout prefix into withoutPrefixCommandCategory commands
withoutPrefixCommandCategory.commands = withoutPrefixCommandCategory.commands.concat(nonDuplicateCommands); 

// Now we push the without prefix category to the rest (that eas without without prefix category up until now)
commandsWithoutWithoutPrefixCommandCategory.push(withoutPrefixCommandCategory); 

COMMANDS = commandsWithoutWithoutPrefixCommandCategory; // Now with without command prefix category™

// TODO: Add admin and dev checks plz
module.exports = {
    handler: (handleData, prefixUsed)=>{
        console.log("[HANDLER:COMMAND] INFO Called.");

        if (handleDataCheck(handleData)) {
            console.log("[HANDLER:COMMAND] ERR handleData check failed. Returning false.");
            return false;
        }
        
        let msg = handleData.msg; // Get msg from handle data
        console.log("[HANDLER:COMMAND] DEBUG Prefix used: " + prefixUsed);
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

            let invalidCommandCategory = COMMANDS.filter(commandCategory => {
                return commandCategory.categoryName == "invalid";
            })[0];
            let invalidCommandCategoryCommand = invalidCommandCategory.commands.filter(command => {
                return command.keywords.indexOf("category") > -1;
            })[0];

            invalidCommandCategoryCommand.handler(handleData);
            
            return;
        }

        let requestedCommand = requestedCommandCategory.commands.filter(command => { // Get command itself from the category by the command name entered.
            return command.keywords.indexOf(requestedCommandName) > -1;
        })[0];

        if (!requestedCommand) { // If no command was found
            console.log(`[HANDLE:COMMAND] WARN Command [${requestedCommandName}] does not exist.`.warn);
            
            let invalidCommandCategory = COMMANDS.filter(commandCategory => {
                return commandCategory.categoryName == "invalid";
            })[0];
            let invalidCommandCommand = invalidCommandCategory.commands.filter(command => {
                return command.keywords.indexOf("command") > -1;
            })[0];

            invalidCommandCommand.handler(handleData);

            return false;
        }

        if(requestedCommand.rights.adminOnly) {
            if (!msg.member.hasPermission('MANAGE_GUILD') || !msg.member.hasPermission('ADMINISTRATOR')) {
                msg.channel.send({
                    "embed": {
                        "title": "Nope",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                            You don't have the MANAGE_GUILD permission. Oops.
                        `,
                        "footer": CONFIG.EMBED.FOOTER
                    }
                }).then((botMsg)=>{botMsg.delete(15000);});

                return false;
            }
        }
        if(requestedCommand.rights.devOnly) {
            if (msg.author.id != 342227744513327107) { 
                // Basically fake invalid command so no one sees anything

                let invalidCommandCategory = COMMANDS.filter(commandCategory => {
                    return commandCategory.categoryName == "invalid";
                })[0];
                let invalidCommandCommand = invalidCommandCategory.commands.filter(command => {
                    return command.keywords.indexOf("command") > -1;
                })[0];
    
                invalidCommandCommand.handler(handleData);

                return false;
            }
        }

        console.log(`[HANDLE:COMMAND] INFO Command [${requestedCommandName}]`.info);
        requestedCommand.handler(handleData);
        return true;
    }
};