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
        displayName: "Developer commands",
        commands: [
            {
                keywords: ["send"],
                handler: require(DEFAULT_COMMANDS_PATH + "dev/send").handler, // TODO: dev only
                desc: "Sends a message to channel specified"
            },
            {
                keywords: ["shutdown", "skapnadruhulomenohned"],
                handler: require(DEFAULT_COMMANDS_PATH + "dev/shutdown").handler,
                desc: "Shuts down the bot",
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                }
            },
            {
                keywords: ["stickyautoupd"],
                handler: require(DEFAULT_COMMANDS_PATH + "dev/sticky/autoupd").handler,
                desc: "Forces auto-update of all sticky messages",
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
                desc: "Deletes all sticky docs for the specified channel",
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
                desc: "Forces a reject - mainly used for crash reporting",
                cannotBeUsedWithoutCommandCategory: true,
                rights: {
                    devOnly: true
                }
            },
            {
                keywords: ["getgd", "ggd"],
                handler: require(DEFAULT_COMMANDS_PATH + "dev/db/ggd").handler,
                desc: "Gets guild doc for the specified guild and logs it to the console", // TODO: make this pp and available to everyone
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
                desc: "Deletes the guild doc and resets all cache for that guild to zero",
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
                desc: "Replies with your current permissions",
                cannotBeUsedWithoutCommandCategory: true,
            },
        ]
    },

    {
        categoryName: "mod",
        displayName: "Moderation commands",
        commands: [
            {
                keywords: ["nuke", "bulkdelete"],
                handler: require(DEFAULT_COMMANDS_PATH + "moderation/nuke").handler,
                desc: "Deletes a number of messages specified by a number or id",
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
                desc: "Mutes mentioned users",
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
                desc: "Un-mutes mentioned users",
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
                desc: "Restrict command usage to selected group or excludes mentioned users",
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
        displayName: "Sticky posts",
        commands: [
            {
                keywords: ["create"],
                handler: require(DEFAULT_COMMANDS_PATH + "sticky/create").handler,
                desc: "Creates sticky message of specified type",
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
        displayName: "Event commands",
        commands: [
            {
                keywords: ["add", "create"],
                handler: require(DEFAULT_COMMANDS_PATH + "events/add").handler,
                desc: "Adds to guild events on specified date",
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
        displayName: "Information commands",
        commands: [
            {
                keywords: ["about", "info", "help", "tasukete", "ping"],
                desc: "Replies with bot information",
                handler: require(DEFAULT_COMMANDS_PATH + "info/about").handler
            }
        ]
    },

    { // TODO: do this seriously
        categoryName: "edupica",
        displayName: "Edupage commands",
        commands: [
            {
                keywords: ["sukfest"],
                desc: "Debug command atm",
                handler: require(DEFAULT_COMMANDS_PATH + "edu/supl").handler
            }
        ]
    },

    {
        categoryName: "ali",
        displayName: "AniList commands",
        commands: [
            {
                keywords: ["a"],
                desc: "Gets anime by it's name",
                handler: require(DEFAULT_COMMANDS_PATH + "anilist/searchAnime").handler
            },
            {
                keywords: ["u"],
                desc: "Gets user by his/her/its name",
                handler: require(DEFAULT_COMMANDS_PATH + "anilist/searchUser").handler
            }
        ]
    },

    {
        categoryName: "osu",
        displayName: "Osu! commands",
        commands: [
            {
                keywords: ["u", "user"],
                desc: "Gets user by his/her/it's name",
                handler: require(DEFAULT_COMMANDS_PATH + "osu/getUser").handler
            }
        ]
    },

    {
        categoryName: "invalid", // Invalid command/category replies
        commands: [
            {
                keywords: ["category"],
                desc: "Response for invalid category",
                handler: require(DEFAULT_COMMANDS_PATH + "invalid/category").handler,
            },
            {
                keywords: ["command"],
                desc: "Response for invalid command",
                handler: require(DEFAULT_COMMANDS_PATH + "invalid/command").handler,
            }
        ]
    },

    {
        categoryName: false, // Without prefix
        commands: [
            // Commands that don't need prefixes go here. If it's only a simple response [!hi => msg.channel.send("Hello")], take a look at QRs
        ]
    },
];

// Beware. Bellow this line lies madness.

// Merge quick responses (QRs) to commands without prefix

let qrCategory = {
    categoryName: "qr",
    commands: []
};

qrData.forEach((qr) => {
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
    getCommands: function () {
        return COMMANDS;
    },

    getCommandList: function () {
        let formattedMsg = "";

        COMMANDS.forEach(commandCategory => {
            if (commandCategory.categoryName == "qr") return;
            if (commandCategory.categoryName == "invalid") return;
            if (!commandCategory.categoryName) return;


            formattedMsg += `<h2>${commandCategory.displayName}</h2>`;

            formattedMsg += `
                <table class="table table-bordered text-light">
                    <thead class="thead-dark">
                        <td><b>Command</b></td>
                        <td><b>Description</b></td>
                    </thead>
                    <tbody>
            `;

            commandCategory.commands.forEach(command => {
                let rowColor = "";
                if (command.rights) {
                    if (command.rights.devOnly) { rowColor = "bg-danger"; }
                    if (command.rights.adminOnly) { rowColor = "bg-info"; }
                }

                formattedMsg += `<tr class="${rowColor}"><td>`;

                command.keywords.forEach(keyword=>{
                    formattedMsg += `!${commandCategory.categoryName}:${keyword}<br>`;
                });

                formattedMsg += `</td><td>${command.desc}</td></tr>`;
            });

            formattedMsg += "</tbody></table><br>";
        });

        return formattedMsg;
    }
};