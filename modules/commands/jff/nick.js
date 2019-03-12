
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg, discordClient) {
        let newNick = msg.content.slice(6); // !nick bla => bla

        msg.guild.member(discordClient.user).setNickname(newNick).then(()=>{
            if (newNick == "") {
                msg.channel.send({
                    "embed": {
                        "title": "Nick",
                        "color": COLORS.GREEN,
                        "description": `Nick bol vymazaný.`
                    }
                });
            }else{
                msg.channel.send({
                    "embed": {
                        "title": "Nick",
                        "color": COLORS.GREEN,
                        "description": `Nick bol zmenený na **${newNick}**`
                    }
                });
            }
        }).catch((e)=>{
            console.error(e);
            msg.channel.send({
                "embed": {
                    "title": "Nick",
                    "color": COLORS.RED,
                    "description": `Nepodarilo sa zmeniť ~~d~~nick. Možno moc dlhý? ( ͡° ͜ʖ ͡°)`
                }
            });
        }); 
    }
}