
const COLORS = require("../../consts").COLORS;
const e621api = require('../../e621api');
const globalVariables = require("../../globalVariables");

module.exports = {
    command: function(msg) {
        let usersObj = globalVariables.get("usersObj");
        
        if (!usersObj[msg.author.id].agreedWarning) {
            msg.author.send({
                "embed": {
                    "title": "Varovanie!",
                    "description": `
                        Hej emm...práve si chcel použiť !e621 príkaz...
                        Pre bezpečnosť tých, čo nevedia čo tento príkaz robí dávam toto family-friendly SFW varovanie:
                        
                        Pokiaľ nevieš čo tento príkaz robí plz ako nepouživaj ho...pre tvoje dobro...
                        Pokiaľ však vieš, čo tento príkaz robí odpovedz !agree a už ťa nebudem otravovať ;)`,
                    "color": COLORS.YELLOW
                }
            });
            return;
        }

        msg.channel.send({
            "embed": {
                "title": "Loading...",
                "description": "Loading image from e621...this ***MAY*** take a **while**",
                "color": COLORS.BLUE
            }
        }).then((sentMsg)=>{
            e621api.random("m/m", "E", 1, post => {
                msg.channel.send({
                    "embed": {
                        "title": "by " + post[0]['author'],
                        "description": "**Favs:** " + post[0].fav_count + "\n**Artists:** " + JSON.stringify(post[0].artist) + "\n**Tags:** " + JSON.stringify(post[0].tags),
                        "color": COLORS.GREEN
                    },
                    "files": [post[0]['file_url']]
                }).then(()=>{
                    sentMsg.delete();
                });
                console.log("[DEBUG] E621:" + JSON.stringify(post));
            });
        });
    }
}