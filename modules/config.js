/*

    Main configuration module.
    
*/

const handleDataCheck = require("../checks/handleData").check;

const CONFIG = {
    BOT: {
        BUILD_INFO: {
            BUILD: "19.re.beta",
            BUILD_STRING: "local build",
        }
    },

    DISCORD: {
        PREFIXES: ["tea!", "!"]
    },

    EMBED: {
        COLORS: {
            DEFAULT:    0x0088ff,
            INFO:       0x0088ff,
            SUCCESS:    0x22ff00,
            PROGRESS:   0x5500ff,
            WARN:       0xffff00,
            FAIL:       0xff2222,
            STICKY:     0x00ffaa
        },
        FOOTER: function(handleData){
            if (handleDataCheck(handleData, true)) {
                return {
                    //"icon_url": "https://cdn.discordapp.com/avatars/555826737066278942/211ca3a8b06d60210ffcfcf96845ca80.png",
                    "text": `Build ${CONFIG.BOT.BUILD_INFO.BUILD_STRING} | by FajsiEx`
                };
            }
            return {
                //"icon_url": "https://cdn.discordapp.com/avatars/555826737066278942/211ca3a8b06d60210ffcfcf96845ca80.png",
                "text": `Build ${CONFIG.BOT.BUILD_INFO.BUILD_STRING} | by FajsiEx | Caller: ${handleData.msg.author.tag}`
            };
        }
    },

    SECRETS: {
        DISCORD: {
            TOKEN: process.env.T_DT
        },
        DATABASE: {
            URI: process.env.T_DURI
        },
        SENTRY: {
            DSN: process.env.T_SDSN
        }
    },

    SENTRY: {}
};

CONFIG.BOT.BUILD_INFO.BUILD_STRING = `${CONFIG.BOT.BUILD_INFO.BUILD}`;

module.exports = CONFIG;