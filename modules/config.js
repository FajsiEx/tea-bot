/*

    Main configuration module.
    TODO: Fucking rewrite this
*/

const handleDataCheck = require("../checks/handleData").check;

const CONFIG = {
    BOT: {
        BUILD_INFO: {
            BUILD: "19.alpha",
            BUILD_STRING: "local build",
        }
    },

    DISCORD: {
        PREFIXES: ["tea!", "!"]
    },

    EMBED: {
        COLORS: {
            DEFAULT:    1616639,
            INFO:       1616639,
            SUCCESS:    4521796,
            PROGRESS:   13041919,
            WARN:       14540032,
            FAIL:       16720418,
            STICKY:     65491
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

    AESTHETICS: {
        BOT_LOGO_ASCII: "[removed]"
    },

    SENTRY: {}
};

CONFIG.BOT.BUILD_INFO.BUILD_STRING = `${CONFIG.BOT.BUILD_INFO.BUILD}`;

module.exports = CONFIG;