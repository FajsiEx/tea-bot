
const globalVariables = require("../../globalVariables");
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg) {
        let guildMusicConns = globalVariables.get("musicConnections");
        if (!guildMusicConns) { // In the case if the var fails to load from db,
            guildMusicConns = {} // create it and we will save it later in the code.
        }

        let guildId = msg.guild.id;
        let guildMusicConn = guildMusicConns[guildId];

        if (!guildMusicConn) {
            msg.channel.send({
                "embed": {
                    "title": "Stop",
                    "color": COLORS.RED,
                    "description": `
                        Nič nehraje.
                    `
                }
            });
            return;
        }

        guildMusicConn.queue = [];
        guildMusicConn.stream.end();
        guildMusicConn.conn.disconnect();

        guildMusicConns[guildId] = guildMusicConn;

        globalVariables.set("musicConnections", guildMusicConns);

        msg.channel.send({
            "embed": {
                "title": "Stop",
                "color": COLORS.GREEN,
                "description": `
                    Rada bola vyprázdnená.
                `
            }
        });
    }
}