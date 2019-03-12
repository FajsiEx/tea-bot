const request = require("request");
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg) {
        request({
            url: "https://www.reddit.com/r/adlerka/random/.json",
            json: true
        }, (err, res, data)=>{
            if (!err && res.statusCode == 200) {
                try{
                    let randomIndex = Math.floor(Math.random() * data.data.children.length)
                    msg.channel.send({
                        "files": [data.data.children[randomIndex].data.url]
                    });
                }catch(e){
                    console.error(e);
                    msg.channel.send({
                        "embed": {
                            "title": "Error",
                            "color": COLORS.RED,
                            "description": "Vyskytla sa chyba pri requestovaní random postu z redditu."
                        }
                    });
                }
            }else{
                msg.channel.send({
                    "embed": {
                        "title": "Error",
                        "color": COLORS.RED,
                        "description": "Vyskytla sa chyba pri requestovaní random postu z redditu."
                    }
                });
            }
        });
    }
}