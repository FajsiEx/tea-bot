
const BUILD = "19.3a";
const BUILD_STRING = `${BUILD} InDev`;
const COMMAND_PREFIXES = ["t!"];
const COLORS = {
    FAIL:       16720418,
    WARN:       14540032,
    INFO:       1616639,
    DEFAULT:    this.INFO,
    PROGRESS:   13041919,
    SUCCESS:    4521796,
    STICKY:     65491
};
const FOOTER = {
    "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
    "text": `Build VERSION | by FajsiEx`
};
const INVALID_COMMAND_CATEGORY_MSG = {
    embed: {
        "title": "Invalid command category",
        "color": COLORS.FAIL,
        "description": `
            Look at the docs for valid command categories and their commands
        `,
        "footer": false
    }
};
const INVALID_COMMAND_MSG = {
    embed: {
        "title": "Invalid command",
        "color": COLORS.FAIL,
        "description": `
            Look at the docs for valid command categories and their commands
        `,
        "footer": false
    }
};
const BOT_LOGO_ASCII = `
                                 .,***********,.                                  
                       ******************************/***//*                      
                  *****************************************/*///,                 
               ***************************************    **/////                 
            *****************************************      *////*                 
          *******************************************      ***///                 
        .************************,        ***********      ******                 
       ********************          .***************      ******                 
      ****************            *******************      ******                 
      ************            ***********************      ******                 
     **********            **************************      ******                 
     *******           ,*****************************      ******                 
    .*****          .********************     *******      ******                 
    ,***          ***********************      ******      ******                 
    .*         ,*************************      ******       .**                   
             ****************************      ******                             
           *******************    *******        **                               
         **********  ,*******      ******                                         
       **********      ******      ******                                         
      ***********      ******      ******                                         
    ,************      ******      ******                                         
   ******* ******      ******      ******                                         
  ******.  ******      ******      ******                                         
 ******    ******      ******      ******                                         
.*****     ******       ****       ******                                         
   ,,      ******                  ******                                         
           ******                  ******                                         
           ******                   ***,                                          
             ,*                              
`;

module.exports = {
    BOT: {
        BUILD_INFO: {
            BUILD: BUILD,
            BUILD_STRING: BUILD_STRING
        }
    },

    DISCORD: {
        PREFIXES: COMMAND_PREFIXES
    },

    EMBED: {
        COLORS: COLORS,
        FOOTER: FOOTER
    },

    MSGS: {
        INVALID_COMMAND: INVALID_COMMAND_MSG,
        INVALID_COMMAND_CATEGORY: INVALID_COMMAND_CATEGORY_MSG
    },
    

    SECRETS: {
        DISCORD: {
            TOKEN: process.env.T_DT
        }
    },

    AESTHETICS: {
        BOT_LOGO_ASCII: BOT_LOGO_ASCII
    }
};

console.log("[MODULE:CONFIG] WORKING Init config.".working);
module.exports.BOT.BUILD_INFO.BUILD_STRING = module.exports.BOT.BUILD_INFO.BUILD_STRING.replace("VERSION", module.exports.BOT.BUILD_INFO.BUILD);
module.exports.EMBED.FOOTER.text = module.exports.EMBED.FOOTER.text.replace("VERSION", module.exports.BOT.BUILD_INFO.BUILD_STRING);
console.log("[MODULE:CONFIG] DONE Init config".success);