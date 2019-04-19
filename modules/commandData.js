/*

    Tea-bot
    © FajsiEx 2019
    Licensed under MIT license - see LICENSE.md for the full license text

    Module: commandData
    Desc: handles storing and access to command data.

*/

const DEFAULT_COMMMANDS_PATH = "../commands/";

// Just add command™
let COMMANDS = [
    {
        categoryName: "dev",
        commands: [{
                keywords: ["ping"],
                handler: require(DEFAULT_COMMMANDS_PATH + "ping").handler,
            },
            {
                keywords: ["send"],
                handler: require(DEFAULT_COMMMANDS_PATH + "dev/send").handler,
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
                keywords: ["stickycreate"],
                handler: require(DEFAULT_COMMMANDS_PATH + "dev/sticky/create").handler,
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
                keywords: ["intread"],
                handler: require(DEFAULT_COMMMANDS_PATH + "dev/int/get").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                }
            },
            {
                keywords: ["intwrite"],
                handler: require(DEFAULT_COMMMANDS_PATH + "dev/int/set").handler,
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
            },
            {
                keywords: ["cacheread"],
                handler: require(DEFAULT_COMMMANDS_PATH + "dev/cache/getcache").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                }
            },
            {
                keywords: ["cachewrite"],
                handler: require(DEFAULT_COMMMANDS_PATH + "dev/cache/setcache").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                }
            }
        ]
    },

    {
        categoryName: "mod",
        commands: [{
            keywords: ["nuke", "bulkdelete"],
            handler: require(DEFAULT_COMMMANDS_PATH + "moderation/nuke").handler,
        }]
    },

    {
        categoryName: "cpp",
        commands: [{
            keywords: ["congrats", "congratulations"],
            handler: require(DEFAULT_COMMMANDS_PATH + "copypaste/congrats").handler,
        }]
    },

    {
        categoryName: "invalid", // Invalid command/category replies
        commands: [{
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
        commands: [{
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
COMMANDS.forEach((commandCategory) => {
    if (!commandCategory.categoryName) {
        return;
    } // We don't want to include the commands without prefix
    if (commandCategory.categoryName == "invalid") {
        return;
    } // We wanna filter out the invalid category (only for replying when user enters an invalid smth)

    commandCategory.commands.forEach((command) => { // For every command in the category
        allCommands = allCommands.concat(command); // We add it to allCommands array
        allCommandNames = allCommandNames.concat(command.keywords); // And it's keywords to allCommandNames array
    });
});
console.log("[MODULE:COMMAND_DATA] DEBUG init dump of all commands".debug);
console.log(allCommands);
console.log(allCommandNames);

// Now we detect duplicates
let duplicateCommandNames = [];
let c = [];
allCommandNames.forEach((commandName) => {
    if (c.indexOf(commandName) > -1) {
        if (duplicateCommandNames.indexOf(commandName) < 0) {
            duplicateCommandNames.push(commandName);
        }
    } else {
        c.push(commandName);
    }
});
console.log("[MODULE:COMMAND_DATA] DEBUG init dump of command name dups".debug);
console.log(duplicateCommandNames);

let nonDuplicateCommands = allCommands.filter((command) => {
    let hasDuplicateKayword = false;
    if (command.cannotBeUsedWithoutCommandCategory) {
        return false;
    }
    command.keywords.forEach((keyword) => {
        if (duplicateCommandNames.indexOf(keyword) > -1) {
            hasDuplicateKayword = true;
        }
    });
    return !hasDuplicateKayword;
});
console.log("[MODULE:COMMAND_DATA] DEBUG init non duped commands".debug);
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

module.exports = {

    /*
        Desc: Returns COMMANDS from module's local var
        Input: -
        Return value: Command object with all categories and merged commands from 1only category to no prefix cat
    */
    getCommands: function() {
        return COMMANDS;
    }
};