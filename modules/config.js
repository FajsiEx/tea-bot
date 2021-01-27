/*

    Main configuration module.
    
*/

//const handleDataCheck = require("../checks/handleData").check;

const CONFIG = {
    BOT: {
        BUILD_INFO: {
            BUILD: "20.12.21",
            BUILD_STRING: "release",
        }
    },

    DISCORD: {
        PREFIXES: ["!"]
    },

    EMBED: {
        COLORS: {
            DEFAULT: 0x0088ff,
            INFO: 0x0088ff,
            SUCCESS: 0x22ff00,
            PROGRESS: 0x5500ff,
            WARN: 0xffff00,
            FAIL: 0xff2222,
            STICKY: 0x00ffaa,
            OSU: 0xff66aa
        },
        FOOTER: function (/* handleData */) {
            /* if (handleDataCheck(handleData, true)) {
                return {
                    //"icon_url": "https://cdn.discordapp.com/avatars/555826737066278942/211ca3a8b06d60210ffcfcf96845ca80.png",
                    "text": `Build ${CONFIG.BOT.BUILD_INFO.BUILD_STRING}`
                };
            } */

            return {
                //"icon_url": "https://cdn.discordapp.com/avatars/555826737066278942/211ca3a8b06d60210ffcfcf96845ca80.png",
                "text": `Build ${CONFIG.BOT.BUILD_INFO.BUILD_STRING}`
            };
        }
    },

    SPLASH_STRINGS: {
        STRINGS: [
            "Writing code in a better way from zero",
            "That time I got reincarnated as a rewrite",
            "God's blessing on this wonderful code!",
            "~No Matter How I Look at It, It’s You Guys Fault I’m Crashing!~",
            "Rewrite!!!!!!!!",
            "This rewrite has a beginning, but no end. - Infinite",
            "Rewriting at the Velocity of Light",
            "『XX:me - Escape』 the rewrites",
            "Episode 3: I'm Not Afraid of Rewriting Anymore"
        ],
        GET: function() {
            return (this.STRINGS[Math.floor(Math.random() * 100 % this.STRINGS.length)]);
        }
    },

    SECRETS: {
        ANILIST: {
            TOKEN: process.env.T_ALT
        },
        DISCORD: {
            TOKEN: process.env.T_DT
        },
        DATABASE: {
            URI: process.env.T_DURI
        },
        OSU: {
            TOKEN: process.env.T_OSUT
        },
        SENTRY: {
            DSN: process.env.T_SDSN
        }
    },

    SENTRY: {}
};

CONFIG.BOT.BUILD_INFO.BUILD_STRING = `${CONFIG.BOT.BUILD_INFO.BUILD}`;

module.exports = CONFIG;
