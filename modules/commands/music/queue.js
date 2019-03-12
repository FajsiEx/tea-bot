
const globalVariables = require("../../globalVariables");
const smallFunctions = require("../../smallFunctions");
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
            this.noSongInQueue(msg);
            return;
        }

        if (guildMusicConn.queue.length == 0) {
            this.noSongInQueue(msg);
            return;
        }

        this.showQueue(msg, guildMusicConn.queue);
    },

    showQueue: function(msg, queueArray) {
        let queueString = "";
        let i = ">"

        queueArray.forEach(song => {
            queueString += `**${i}.** ${song.author} - ${song.song} (${smallFunctions.secondsToTimeString(song.duration)})\n`;
            if (i == ">") { // If this was the first song
                i = 0;
            }
            i++;
        });

        msg.channel.send({
            "embed": {
                "title": "Rada",
                "color": COLORS.BLUE,
                "description": `
                    ${queueString}
                `,
                "footer": {
                    "text": "Music príkazy sú ešte v BETA stave. Možno budú fungovať, možno nie. Stabilita sa zlepši s nasledujúcimi verziami :)"
                }
            }
        });
    },

    noSongInQueue: function(msg) {
        msg.channel.send({
            "embed": {
                "title": "Rada",
                "color": COLORS.BLUE,
                "description": `
                    Nič v rade. (pre pridanie do rady: **!play** *link na youtube video*)
                `,
                "footer": {
                    "text": "Music príkazy sú ešte v BETA stave. Možno budú fungovať, možno nie. Stabilita sa zlepši s nasledujúcimi verziami :)"
                }
            }
        });
    }
}