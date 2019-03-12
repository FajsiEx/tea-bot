
const globalVariables = require("../../globalVariables");
const COLORS = require("../../consts").COLORS;
const smallFunctions = require("../../smallFunctions");

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
                    "title": "Skip",
                    "color": COLORS.RED,
                    "description": `
                        Nič nehraje.
                    `,
                    "footer": {
                        "text": "Music príkazy sú ešte v BETA stave. Možno budú fungovať, možno nie. Stabilita sa zlepši s nasledujúcimi verziami :)"
                    }
                }
            });
            return;
        }

        // Will be used in the future, for now disconnecting and playing again does a good job
        // console.log(JSON.stringify(guildMusicConns[guildId].queue))
        // let song = guildMusicConns[guildId].queue.shift();
        // console.log(JSON.stringify(guildMusicConns[guildId].queue))

        // globalVariables.set("musicConnections", guildMusicConns);

        let song = guildMusicConns[guildId].queue[0]; // First song will be shifted so we will display that one.

        guildMusicConn.stream.end(); // This will emit an end event which acts like the song has just ended and takes care of playing the next in queue if there is any

        msg.channel.send({
            "embed": {
                "title": "Skip",
                "color": COLORS.GREEN,
                "description": `
                    Preskočilo sa ${song.author} - ${song.song} (${smallFunctions.secondsToTimeString(song.duration)}).
                `,
                "footer": {
                    "text": "Music príkazy sú ešte v BETA stave. Možno budú fungovať, možno nie. Stabilita sa zlepši s nasledujúcimi verziami :)"
                }
            }
        });
    }
}