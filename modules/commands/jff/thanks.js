
const THX_REPLIES = [
    "You're welcome.",
    "No problem ;)",
    "My pleasure.",
    "Sure.",
    "Anytime :)",
    "Don't bother me again"
]

module.exports = {
    command: function(msg) {
        msg.channel.send(THX_REPLIES[Math.floor(Math.random() * THX_REPLIES.length)]);
    }
}