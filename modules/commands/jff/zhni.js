
module.exports = {
    command: function(msg) {
        const ZHNI_REPLIES = [
            "Sa najedz ked si zhni lol",
            "Keď si zhni, nie si to ty"
        ]
        msg.channel.send(ZHNI_REPLIES[Math.floor(Math.random() * ZHNI_REPLIES.length)]);
    }
}