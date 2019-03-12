
const ytdl = require("ytdl-core");
const fetchVideoInfo = require('youtube-info');
const fs = require("fs");
const YTsearch = require('youtube-search');
 
const YTsearchConfig = {
    maxResults: 5,
    key: process.env.GAPI,
    type: "video"
};

const globalVariables = require("../../globalVariables");
const COLORS = require("../../consts").COLORS;

let tempSongList = false;

module.exports = {
    command: function(msg) {
        // - https://github.com/maurostorch/nodejs-ffmpeg-buildpack
        let commandMessageArray = msg.content.split(" ");

        /*
        msg.channel.send({
            "embed": {
                "title": "Play",
                "color": COLORS.RED,
                "description": `
                    Music is disabled until I get ~~paid~~ the FFMPEG buildpack fixed. Sry i guess.
                `
            }
        });
        return;
        */

        if (!msg.member) {
            msg.channel.send({
                "embed": {
                    "title": "Play",
                    "color": COLORS.RED,
                    "description": `
                        This can be done only in server text channels.
                    `
                }
            });
            return;
        }

        let vc = msg.member.voiceChannel;
        if (!vc) {
            msg.channel.send({
                "embed": {
                    "title": "Play",
                    "color": COLORS.RED,
                    "description": `
                        Nie si vo voice channeli ;_(
                    `
                }
            });
            return;
        }

        let lOfCommand = commandMessageArray[0].length + 1
        let song = msg.content.slice(lOfCommand);
        if (!song) {
            msg.channel.send({
                "embed": {
                    "title": "Play",
                    "color": COLORS.RED,
                    "description": `
                        Neni link ;(
                    `
                }
            });
            return;
        }

        if (parseInt(song)) { // If the arg was a number, we'll assume the user wanted something played from the search list
            if (parseInt(song) >= 1 && parseInt(song) <=5) { // and if the arg number is between 1-5 (the search list range)
                if (!tempSongList) { // If there was nothing to choose from
                    msg.channel.send({
                        "embed": {
                            "title": "Play",
                            "color": COLORS.RED,
                            "description": `
                                Nieje z čoho vyberať (!play niečo)
                            `
                        }
                    });
                    return;
                }

                song = tempSongList[parseInt(song) - 1].link // Selects song from the song list with index song and stores into the var song instead of the song index value
                // Also we must decrement the user index bc arrays start from 0 so user-1=array index (1=0, 2=1, ...)
                tempSongList = false // and empty the song list.
            }
        }

        let isValidYTlink = song.startsWith("https://www.youtube.com/watch?v=") || song.startsWith("https://youtube.com/watch?v=")

        if (!isValidYTlink) {
            YTsearch(song, YTsearchConfig, function(err, results) {
                if(err) return console.log(err);

                let resultString = "";
                let i = 1

                results.forEach((v)=>{
                    resultString += `**${i}.** [${v.channelTitle} - ${v.title}](${v.link})\n`;
                    i++;
                })

                msg.channel.send({
                    "embed": {
                        "title": "Play",
                        "color": COLORS.BLUE,
                        "description": `
                            ${resultString}
                        `
                    }
                });

                tempSongList = results
               
                console.dir(results);
            });
            return;
        }

        let videoID = song.split("=")[1]
        console.log("[PLAY_COMM] Video ID: " + videoID);

        let dlMsg;

        msg.delete();

        this.checkMaxLength(videoID).then((isMaxLength)=>{
            if (isMaxLength) {
                msg.channel.send({
                    "embed": {
                        "title": "Play",
                        "color": COLORS.RED,
                        "description": `
                            Moc dlhé. Maximum 15 minút.
                        `
                    }
                });
                return;
            }

            let fileName = videoID + ".mp3";

            if (fs.existsSync(fileName)) {
                this.addToQ(msg, vc, fileName, videoID, false);
            }else{
                msg.channel.send({
                    "embed": {
                        "title": "Sťahujem...",
                        "color": COLORS.BLUE,
                        "description": `
                            Sťahuje sa ${song}... **Toto bude trvať pár sekúnd...**
                        `
                    }
                }).then((sentMsg)=>{dlMsg = sentMsg});

                let stream = ytdl(
                    song, {
                    audioonly: true
                });
                stream.pipe(fs.createWriteStream(fileName))
                .on('finish', () => {
                    this.addToQ(msg, vc, fileName, videoID, dlMsg);
                });
            }
        }).catch((err)=>{
            msg.channel.send({
                "embed": {
                    "title": "Play",
                    "color": COLORS.RED,
                    "description": `
                        Vyskytla sa chyba pri zisťovaní dĺžky videa. ERR:${err}
                    `
                }
            })
        });
    },

    addToQ: function(msg, vc, fileName, vID, dlMsg) {
        console.log('[PLAY_COMM] Down done.');

        fetchVideoInfo(vID, (err, info)=> {
            if (err) throw new Error(err);

            let guildId = msg.guild.id;
            let guildMusicConns = globalVariables.get("musicConnections");

            if (!guildMusicConns) { // In the case if the var fails to load from db,
                guildMusicConns = {} // create it and we will save it later in the code.
            }

            let guildMusicConn = guildMusicConns[guildId];

            if (!guildMusicConn) {
                console.log('[PLAY_COMM] GMC DNE. Creating.');

                guildMusicConns[guildId.toString()] = {
                    test: "dsds",
                    vc: "",
                    conn: "",
                    stream: "",
                    queue: []
                }

                console.log("[PLAY_COMM] DEBUG GMCADD GID: " + guildId);
            }

            console.log("[PLAY_COMM] DEBUG ATQ: " + guildMusicConns[guildId]);
            guildMusicConns[guildId].vc = vc;

            guildMusicConns[guildId].queue.push({
                file: fileName,
                song: info.title,
                author: info.owner,
                duration: info.duration
            });

            globalVariables.set("musicConnections", guildMusicConns);
            
            let playEmbedObj = {
                "embed": {
                    "title": "Pridané do rady.",
                    "color": COLORS.GREEN,
                    "description": `
                        **${info.title}** od **${info.owner}** (${info.duration}s) sa pridala do rady.
                    `,
                    "footer": {
                        "text": "Music príkazy sú ešte v BETA stave. Možno budú fungovať, možno nie. Stabilita sa zlepši s nasledujúcimi verziami :)"
                    }
                }
            };
    
            if (!dlMsg) {
                msg.channel.send(playEmbedObj);
            }else{
                dlMsg.edit(playEmbedObj);
            }

            if (guildMusicConns[guildId].queue.length == 1) {
                console.log("[PLAY_COMM] First song in queue. Playing.");
                this.playSong(guildId);
            }
        });
    },

    playSong: function(guildId) {
        let guildMusicConns = globalVariables.get("musicConnections");
        let guildMusicConn = guildMusicConns[guildId];

        if (!guildMusicConn) {console.error("[PLAY_COMM] Guild music obj does not exist. Aborting."); return;}

        guildMusicConn.vc.join().then(connection => {
            console.log("[PLAY_COMM] Joined a VC");

            console.log("[PLAY_COMM] GID: " + guildId);
            console.log("[PLAY_COMM] QUEUE: " + JSON.stringify(guildMusicConn.queue));
    
            let stream = connection.playFile(guildMusicConn.queue[0].file).on('end', () => {
                console.log('[PLAY_COMM] Song done.');
                guildMusicConn.queue.shift();

                guildMusicConns[guildId] = guildMusicConn;

                globalVariables.set("musicConnections", guildMusicConns);

                if (guildMusicConn.queue.length == 0) {
                    console.log('[PLAY_COMM] No more songs in queue. Leaving.');
                    connection.channel.leave();
                }else{
                    console.log('[PLAY_COMM] More songs in queue. Playing.');
                    this.playSong(guildId);
                }
            });

            guildMusicConns[guildId].conn = connection;
            guildMusicConns[guildId].stream = stream;
            globalVariables.set("musicConnections", guildMusicConns);

        }).catch(console.error);
    },

    checkMaxLength: function(videoID) {
        return new Promise((resolve, reject)=> {
            fetchVideoInfo(videoID, (err, info)=> {
                if (err) {
                    reject("video_info_fetch_error");
                    throw new Error(err);
                }

                if(info.duration > 15*60) { // If the video is longer than 15*60 seconds
                    resolve(true); // return true = song won't play
                }else{
                    resolve(false); // if it's in the length limit return false
                }
            });
        })
    }
}