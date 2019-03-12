
const COLORS = require("../../consts").COLORS;
const GOOGLE_API_KEY = process.env.GAPI;

let request = require("request");

module.exports = {
    command: function(msg) {
        request.get({ // PDP
            "method" : "GET",
            "uri": "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC-lHJZR3Gqxm24_Vd_AJ5Yw&key=" + GOOGLE_API_KEY,
            "followRedirect":false,
            "headers": {
                'User-Agent': 'Tea-bot/1.1'
            }
        }, function(err, res, body) {
            data = JSON.parse(body);
            let pSub = data.items[0].statistics.subscriberCount;
            request.get({ // PDP
                "method" : "GET",
                "uri": "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCq-Fj5jknLsUf-MWSy4_brA&key=" + GOOGLE_API_KEY,
                "followRedirect":false,
                "headers": {
                    'User-Agent': 'Tea-bot/1.1'
                }
            }, function(err, res, body) {
                console.log("[PVT_COMMAND] DEBUG: res:" + body)
                console.log("[PVT_COMMAND] DEBUG: key:" + GOOGLE_API_KEY)
                data = JSON.parse(body);
                let tSub = data.items[0].statistics.subscriberCount;
                let deltaSub = (pSub - tSub).toLocaleString();

                pSub = parseInt(pSub).toLocaleString();
                tSub = parseInt(tSub).toLocaleString();

                msg.channel.send({
                    "embed": {
                        "title": "**PewDiePie** vs **T-series**",
                        "color": COLORS.BLUE,
                        "description": pSub + " vs " + tSub + "\nPewDiePie je o **" + deltaSub + "** odoberateľov popredu.\n[Subscribe to PewDiePie](https://www.youtube.com/user/PewDiePie)",
                    }
                });
                
            });
        });        
    }
}