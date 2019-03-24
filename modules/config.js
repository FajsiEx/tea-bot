
console.log("[MODULE:CONFIG] WORKING Init config.".working);

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
    "text": `Build ${BUILD_STRING} | by FajsiEx`
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

// Shove everything into an object
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

    SECRETS: {
        DISCORD: {
            TOKEN: process.env.T_DT
        }
    },

    AESTHETICS: {
        BOT_LOGO_ASCII: BOT_LOGO_ASCII
    }
};

console.log("[MODULE:CONFIG] DONE Init config".success);