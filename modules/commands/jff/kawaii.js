
module.exports = {
    command: function(msg) {
        const KAWAII_REPLY_MSGS = [
            "(◕‿◕✿)",
            "(◠‿◠✿)",
            "(◠﹏◠✿)",
            "(◡‿◡✿)",
            "╰(◡‿◡✿╰)",
            "(づ｡◕‿‿◕｡)づ",
            "(｡◕‿◕｡)"
        ]
        msg.channel.send(KAWAII_REPLY_MSGS[Math.floor(Math.random() * KAWAII_REPLY_MSGS.length + 1)-1]);
    }
}