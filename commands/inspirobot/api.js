const fetch = require("node-fetch");

// Thx https://github.com/kishlaya/inspirobot-bot
module.exports = {
    getImage: async function() {
        try {
            let response = await fetch("http://inspirobot.me/api?generate=true");
            let url = await response.text();
            return url;
        }catch(e){
            throw("Failed to fetch: " + e);
        }
    }
};
