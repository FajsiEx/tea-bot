
const COLORS = require("../../consts").COLORS;
const DEV_USERID = require("../../consts").DEV_USERID;

module.exports = {
    command: function(msg, discordClient) {
        let commandMessageArray = msg.content.split(" ");
        
        if (msg.author.id != DEV_USERID) {
            msg.channel.send({
                "embed": {
                    "title": "Nope nejsi môj master OwO",
                    "color": COLORS.RED,
                    "footer": {
                        "text": "Forgive me for the cancer I've done."
                    }
                }
            });
            return;
        }
        
        let message = msg.content;
        
        let channel = commandMessageArray[1];
        let sendMsg = message.slice(message.indexOf(message.split(" ", 2)[1]) + message.split(" ", 2)[1].length + 1)
        
        discordClient.channels.get(channel).send(sendMsg);
    }
}