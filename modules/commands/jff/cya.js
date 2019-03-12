
module.exports = {
    command: function(msg) {
        const CYA_REPLIES = [
            "See you next time ;)",
            "Cya next time...",
            "See ya next time :)"
        ]
        msg.channel.send(CYA_REPLIES[Math.floor(Math.random() * CYA_REPLIES.length)]);
    }
}