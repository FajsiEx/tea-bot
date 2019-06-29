/*

    Tea-bot
    © FajsiEx 2019
    Licensed under MIT license - see LICENSE.md for the full license text

    Module: commandData
    Description: handles storing and access to command data.

*/

const DEFAULT_COMMANDS_PATH = "/commands/";
const qrHandler = require("/qr/qrHandler");
const qrData = require("/qr/qrData");

// Just add command™
let COMMANDS = [
    {
        categoryName: "dev",
        commands: [
            {
                keywords: ["send"],
                handler: require(DEFAULT_COMMANDS_PATH + "dev/send").handler,
            },
            {
                keywords: ["shutdown", "skapnadruhulomenohned"],
                handler: require(DEFAULT_COMMANDS_PATH + "dev/shutdown").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                }
            },
            {
                keywords: ["stickyautoupd"],
                handler: require(DEFAULT_COMMANDS_PATH + "dev/sticky/autoupd").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                },
                requirements: {
                    channelType: "text",
                    readyDatabase: true
                }
            },
            {
                keywords: ["stickydelall"],
                handler: require(DEFAULT_COMMANDS_PATH + "dev/sticky/deleteall").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                },
                requirements: {
                    channelType: "text",
                    readyDatabase: true
                }
            },
            {
                keywords: ["throwup"],
                handler: require(DEFAULT_COMMANDS_PATH + "dev/throwup").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                }
            },
            {
                keywords: ["getgd", "ggd"],
                handler: require(DEFAULT_COMMANDS_PATH + "dev/db/ggd").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                },
                requirements: {
                    readyDatabase: true
                }
            },
            {
                keywords: ["deletegd", "delgd"],
                handler: require(DEFAULT_COMMANDS_PATH + "dev/db/deletegd").handler,
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                },
                requirements: {
                    readyDatabase: true
                }
            },
            {
                keywords: ["testperm"],
                handler: require(DEFAULT_COMMANDS_PATH + "dev/tests/perm").handler,
                cannotBeUsedWithoutCommandCategory: true,
            },
        ]
    },

    {
        categoryName: "mod",
        commands: [
            {
                keywords: ["nuke", "bulkdelete"],
                handler: require(DEFAULT_COMMANDS_PATH + "moderation/nuke").handler,
                rights: {
                    adminOnly: true
                },
                requirements: {
                    channelType: "text"
                }
            },
            {
                keywords: ["mute"],
                handler: require(DEFAULT_COMMANDS_PATH + "moderation/mute/mute").handler,
                rights: {
                    adminOnly: true
                },
                requirements: {
                    channelType: "text"
                }
            },
            {
                keywords: ["unmute"],
                handler: require(DEFAULT_COMMANDS_PATH + "moderation/mute/unmute").handler,
                rights: {
                    adminOnly: true
                },
                requirements: {
                    channelType: "text"
                }
            },
            {
                keywords: ["restrict"],
                handler: require(DEFAULT_COMMANDS_PATH + "moderation/restrict/restrict").handler,
                rights: {
                    adminOnly: true
                },
                requirements: {
                    channelType: "text",
                    readyDatabase: true
                }
            },
        ]
    },

    {
        categoryName: "sticky",
        commands: [
            {
                keywords: ["create"],
                handler: require(DEFAULT_COMMANDS_PATH + "sticky/create").handler,
                rights: {
                    adminOnly: true
                },
                requirements: {
                    channelType: "text",
                    readyDatabase: true
                }
            }
        ]
    },

    {
        categoryName: "events",
        commands: [
            {
                keywords: ["add", "create"],
                handler: require(DEFAULT_COMMANDS_PATH + "events/add").handler,
                cannotBeUsedWithoutCommandCategory: true,
                requirements: {
                    channelType: "text",
                    readyDatabase: true
                }
            }
        ]
    },

    {
        categoryName: "info",
        commands: [
            {
                keywords: ["about", "info", "help", "tasukete", "ping"],
                handler: require(DEFAULT_COMMANDS_PATH + "info/about").handler
            }
        ]
    },

    { // TODO: do this seriously
        categoryName: "edupica",
        commands: [
            {
                keywords: ["sukfest"],
                handler: require(DEFAULT_COMMANDS_PATH + "edu/supl").handler
            }
        ]
    },

    {
        categoryName: "ali",
        commands: [
            {
                keywords: ["a"],
                handler: require(DEFAULT_COMMANDS_PATH + "anilist/searchAnime").handler
            },
            {
                keywords: ["u"],
                handler: require(DEFAULT_COMMANDS_PATH + "anilist/searchUser").handler
            }
        ]
    },

    {
        categoryName: "osu",
        commands: [
            {
                keywords: ["u", "user"],
                handler: require(DEFAULT_COMMANDS_PATH + "osu/getUser").handler
            }
        ]
    },

    {
        categoryName: "invalid", // Invalid command/category replies
        commands: [
            {
                keywords: ["category"],
                handler: require(DEFAULT_COMMANDS_PATH + "invalid/category").handler,
            },
            {
                keywords: ["command"],
                handler: require(DEFAULT_COMMANDS_PATH + "invalid/command").handler,
            }
        ]
    },

    {
        categoryName: false, // Without prefix
        commands: [
            {
                keywords: ["hi", "hello", "konichiwa"],
                handler: require(DEFAULT_COMMANDS_PATH + "hi").handler,
            }
        ]
    },
];

// Beware. Bellow this line lies madness.

// Merge quick responses (QRs) to commands without prefix

let qrCategory = {
    categoryName: "qr",
    commands: []
};

qrData.forEach((qr)=>{
    qrCategory.commands.push({
        keywords: qr.keywords,
        handler: qrHandler.handler
    });
});

COMMANDS.push(qrCategory); // Push the resulted category in the commands - they will be processed later ;)



// We merge all commands into one array
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

let nonDuplicateCommands = allCommands.filter((command) => {
    let hasDuplicateKeyword = false;
    if (command.cannotBeUsedWithoutCommandCategory) {
        return false;
    }
    command.keywords.forEach((keyword) => {
        if (duplicateCommandNames.indexOf(keyword) > -1) {
            hasDuplicateKeyword = true;
        }
    });
    return !hasDuplicateKeyword;
});

let withoutPrefixCommandCategory = COMMANDS.filter((commandCategory) => { // Get the "without prefix" category
    return commandCategory.categoryName == false;
})[0];
let commandsWithoutWithoutPrefixCommandCategory = COMMANDS.filter((commandCategory) => { // And get all command categories EXCEPT the "without prefix" category
    return commandCategory.categoryName != false;
});

// We merge commands from nonDuplicateCommands and commands without prefix into withoutPrefixCommandCategory commands
withoutPrefixCommandCategory.commands = withoutPrefixCommandCategory.commands.concat(nonDuplicateCommands);

// Now we push the without prefix category to the rest (that was without without prefix category up until now)
commandsWithoutWithoutPrefixCommandCategory.push(withoutPrefixCommandCategory);

COMMANDS = commandsWithoutWithoutPrefixCommandCategory; // Now with without command prefix category™

module.exports = {

    /*
        Description: Returns COMMANDS from module's local variable
        Input: -
        Return value: Command object with all categories and merged commands from 1only category to no prefix cat
    */
    getCommands: function() {
        return COMMANDS;
    }
};