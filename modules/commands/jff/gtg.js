
module.exports = {
    command: function(msg) {
        const GTG_REPLIES = [
            "I'll be waiting...Nigga",
            "Cya next time",
            "Cya later, alligator"
        ]
        msg.channel.send(GTG_REPLIES[Math.floor(Math.random() * GTG_REPLIES.length)]);
    }
}