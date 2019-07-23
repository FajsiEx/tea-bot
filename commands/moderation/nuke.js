/*

    Nukes messages in a chan

*/

const CONFIG = require("../../modules/config");
const outdent = require("outdent");

module.exports = {
    handler: async function (handleData) {
        let msg = handleData.msg;

        let type = msg.content.split(" ")[1];
        let arg = msg.content.split(" ")[2];

        //* count nuke type
        if (type == "count") {
            if (!parseInt(arg)) {
                try {
                    await module.exports.responses.error.noCount(handleData);
                } catch (e) {
                    throw ("Failed to send noCount fail message: " + e);
                }
                return 1;
            }

            if (arg > 99 || arg < 1) {
                try {
                    await module.exports.responses.error.rangeError(handleData);
                } catch (e) {
                    throw ("Failed to send invalidCount fail message: " + e);
                }
                return 2;
            } 

            try {
                await msg.delete(); // Delete the OP message also
                await msg.channel.bulkDelete(arg);
            } catch (e) {
                console.log(`Failed to delete messages: ${e}`.warn);
                module.exports.responses.error.deleteError(handleData);
                return 3;
            }

            try {
                await module.exports.responses.success.nuked(handleData, arg);
            } catch (e) {
                throw ("Failed to send success message: " + e);
            }
            return 0;

            //* from nuke type
        } else if (type == "from") {
            if (!parseInt(arg)) { // If arg is not a number
                try {
                    await module.exports.responses.error.idIntError(handleData);
                } catch (e) {
                    throw ("Failed to send invalid id error message: " + e);
                }
                return 6;
            }

            let messages;
            try {
                messages = await msg.channel.fetchMessages({
                    after: arg
                });
            } catch (e) {
                try {
                    await module.exports.responses.error.noFetchedMessages(handleData);
                } catch (e) {
                    throw ("Failed to send empty fetch message collection fail message: " + e);
                }
                return 4;
            }

            if (messages.size < 1) {
                try {
                    await module.exports.responses.error.noFetchedMessages(handleData);
                } catch (e) {
                    throw ("Failed to send empty fetch message collection fail message: " + e);
                }
                return 4;
            }

            if (messages.size > 99) {
                try {
                    await module.exports.responses.error.noFetchedMessages(handleData);
                } catch (e) {
                    throw ("Failed to send empty fetch message collection fail message: " + e);
                }
                return 5;
            }

            try {
                await msg.channel.bulkDelete(messages);
            } catch (e) {
                console.log(`Failed to delete messages: ${e}`.warn);
                module.exports.responses.error.deleteError(handleData);
                return 3;
            }

            try { // For the edge case that happens sometimes for some reason.
                let selectedMessage = await msg.channel.fetchMessage(arg);
                selectedMessage.delete();
            } catch (e) { } // It's fine.

            try {
                module.exports.responses.success.nuked(handleData, messages.size);
            } catch (e) {
                throw ("Failed to send success message: " + e);
            }

            return 0;

        } else {
            try {
                await module.exports.responses.error.noTypeError(handleData);
            } catch (e) {
                throw ("Failed to send invalid type message: " + e);
            }
        }
    }, // End of handler

    responses: {
        success: {
            nuked: async function (handleData, messageCount) {
                let botMsg;
                try {
                    botMsg = await handleData.msg.channel.send({
                        "embed": {
                            "title": "Nuked",
                            "color": CONFIG.EMBED.COLORS.SUCCESS,
                            "description": outdent`
                                Deleted \`${messageCount}\` messages.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    });
                } catch (e) {
                    throw ("Failed to send success response message: " + e);
                }

                try { botMsg.delete(5000); }
                catch (e) { console.log(`Could not delete message: ${e}`); }

                return true;
            }
        },
        error: {
            noTypeError: async function (handleData) {
                let botMsg;
                try {
                    botMsg = await handleData.msg.channel.send({
                        "embed": {
                            "title": "Nuke | No count",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                You must specify a type of nuke
                                \`nuke count 60\`
                                \`nuke after (msgId)\`
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    });
                } catch (e) {
                    throw ("Failed to send noTypeError response message: " + e);
                }

                try { botMsg.delete(10000); }
                catch (e) { console.log(`Could not delete message: ${e}`); }

                return true;
            },

            noCount: async function (handleData) {
                let botMsg;
                try {
                    botMsg = await handleData.msg.channel.send({
                        "embed": {
                            "title": "Nuke | No count",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                You must specify the number of messages to be nuked (maximum 99)
                                \`!nuke count 15\`
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    });
                } catch (e) {
                    throw ("Failed to send noCount response message: " + e);
                }

                try { botMsg.delete(10000); }
                catch (e) { console.log(`Could not delete message: ${e}`); }

                return true;
            },

            rangeError: async function (handleData) {
                let botMsg;
                try {
                    botMsg = await handleData.msg.channel.send({
                        "embed": {
                            "title": "Nuke | Invalid range",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                Only 1 to 99 messages can be deleted.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    });
                } catch (e) {
                    throw ("Failed to send rangeError response message: " + e);
                }

                try { botMsg.delete(10000); }
                catch (e) { console.log(`Could not delete message: ${e}`); }

                return true;
            },

            deleteError: async function (handleData) {
                let botMsg;
                try {
                    botMsg = await handleData.msg.channel.send({
                        "embed": {
                            "title": "Nuke | Couldn't nuke",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                Make sure the messages you want to nuke are less than 14 days old. (discord's API limit)
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    });
                } catch (e) {
                    throw ("Failed to send deleteError response message: " + e);
                }

                try { botMsg.delete(10000); }
                catch (e) { console.log(`Could not delete message: ${e}`); }

                return true;
            },

            idIntError: async function (handleData) {
                let botMsg;
                try {
                    botMsg = await handleData.msg.channel.send({
                        "embed": {
                            "title": "Nuke | Invalid message id",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                What you entered as a message id is not valid.
                                \`!nuke after 588437298459443203\`
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    });
                } catch (e) {
                    throw ("Failed to send idIntError response message: " + e);
                }

                try { botMsg.delete(10000); }
                catch (e) { console.log(`Could not delete message: ${e}`); }

                return true;
            },

            noFetchedMessages: async function (handleData) {
                let botMsg;
                try {
                    botMsg = await handleData.msg.channel.send({
                        "embed": {
                            "title": "Nuke | No messages to be deleted",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                There are no message that can be deleted. Select older than the most recent message to use 'after' or copy the right message id.
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    });
                } catch (e) {
                    throw ("Failed to send noFetchedMessages response message: " + e);
                }

                try { botMsg.delete(10000); }
                catch (e) { console.log(`Could not delete message: ${e}`); }

                return true;
            },

            messageTopLimitError: async function (handleData, messageCount) {
                let botMsg;
                try {
                    botMsg = await handleData.msg.channel.send({
                        "embed": {
                            "title": "Nuke | That's too many",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": outdent`
                                Maximum I can delete is 99, but you selected ${messageCount}. That's ${99 - messageCount} over the limit!
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    });
                } catch (e) {
                    throw ("Failed to send messageTopLimitError response message: " + e);
                }

                try { botMsg.delete(10000); }
                catch (e) { console.log(`Could not delete message: ${e}`); }

                return true;
            },

        }
    }
};