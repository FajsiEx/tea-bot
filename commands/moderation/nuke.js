/*

    Nukes messages in a chan

*/

const CONFIG = require("../../modules/config");

module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            if (msg.channel.type != "text") {
                msg.channel.send({
                    "embed": {
                        "title": "Can't do that",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                        Nuke works only in guild text channels. oof.
                    `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).then((botMsg) => {
                    botMsg.delete(10000);
                    return resolve(10);
                }).catch((e)=>{
                    return reject("Failed to send 'not a text channel' fail message: " + e);
                });
                return;
            }

            let type = msg.content.split(" ")[1];
            let arg = parseInt(msg.content.split(" ")[2]);

            if (type == "count") {
                if (!arg) {
                    msg.channel.send({
                        "embed": {
                            "title": "Can't do that",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": `
                                You must specify the number of msgs to be nuked (maximum 99)
                                \`!nuke count 15\`
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    }).then((botMsg) => {
                        botMsg.delete(10000);
                        return resolve(1);
                    }).catch((e)=>{
                        return reject("Failed to send invalid args fail message: " + e);
                    });
                    return;
                }

                if (arg > 99 || arg < 1) {
                    msg.channel.send({
                        "embed": {
                            "title": "Can't do that",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": `
                                Number of messages to be nuked must be in a range of 1-99
                            `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    }).then((botMsg) => {
                        botMsg.delete(10000);
                        return resolve(2);
                    }).catch((e)=>{
                        return reject("Failed to send invalid args fail message: " + e);
                    });
                    return;
                }

                msg.channel.bulkDelete(arg).then(() => {
                    msg.channel.send({
                        "embed": {
                            "title": "Nuked",
                            "color": CONFIG.EMBED.COLORS.SUCCESS,
                            "description": `
                            Deleted \`${arg}\` messages.
                        `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    }).then((botMsg) => {
                        botMsg.delete(10000);
                        return resolve(0);
                    }).catch((e)=>{
                        return reject("Failed to send success message: " + e);
                    });
                    return;
                }).catch(()=>{
                    msg.channel.send({
                        "embed": {
                            "title": "Can't do that",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": `
                            Either the messages are older than 14 days OR I don't have manage messages permission.
                        `,
                            "footer": CONFIG.EMBED.FOOTER(handleData)
                        }
                    }).then((botMsg) => {
                        botMsg.delete(10000);
                        return resolve(100);
                    }).catch((e)=>{
                        return reject("Failed to send 'failed to delete' message: " + e);
                    });
                    return;
                });

            } else if (type == "from") {

                msg.channel.fetchMessages({
                    after: arg
                }).then((messages) => {
                    msg.channel.bulkDelete(messages).then(() => {
                        msg.channel.send({
                            "embed": {
                                "title": "Nuked",
                                "color": CONFIG.EMBED.COLORS.SUCCESS,
                                "description": `
                                    Deleted \`${messages.size}\` messages.
                                `,
                                "footer": CONFIG.EMBED.FOOTER(handleData)
                            }
                        }).then((botMsg) => {
                            botMsg.delete(10000);
                            return resolve(0);
                        }).catch((e)=>{
                            return reject("Failed to send success message: " + e);
                        });
                        return;
                    }).catch(() => {
                        msg.channel.send({
                            "embed": {
                                "title": "Can't do that",
                                "color": CONFIG.EMBED.COLORS.FAIL,
                                "description": `
                                    Either the messages are older than 14 days OR there are more than 99 messages to be deleted OR I don't have manage messages permission.
                                `,
                                "footer": CONFIG.EMBED.FOOTER(handleData)
                            }
                        }).then((botMsg) => {
                            botMsg.delete(10000);
                        });
                        return false;
                    });
                });

            } else {
                msg.channel.send({
                    "embed": {
                        "title": "Can't do that",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": `
                            You must specify a type of nuke
                            \`nuke count 60\`
                            \`nuke from (msgId)\`
                        `,
                        "footer": CONFIG.EMBED.FOOTER(handleData)
                    }
                }).then((botMsg) => {
                    botMsg.delete(10000);
                    return resolve(3);
                }).catch((e)=>{
                    return reject("Failed to send 'wrong type of nuke' message: " + e);
                });
                return;
            }
        }); // End of promise
    } // End of handler
};