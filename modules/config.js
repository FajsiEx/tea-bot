module.exports = {
    BOT: {
        BUILD_INFO: {
            BUILD: "19.3a",
            BUILD_STRING: "VERSION InDev"
        }
    },

    DISCORD: {
        PREFIXES: ["t!"]
    },

    EMBED: {
        COLORS: {
            FAIL:       16720418,
            WARN:       14540032,
            INFO:       1616639,
            DEFAULT:    this.INFO,
            PROGRESS:   13041919,
            SUCCESS:    4521796,
            STICKY:     65491
        },
        FOOTER: {
            "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
            "text": `Build VERSION | by FajsiEx`
        }
    },
    

    SECRETS: {
        DISCORD: {
            TOKEN: process.env.T_DT
        }
    },

    AESTHETICS: {
        BOT_LOGO_ASCII: `
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
        `
    }
};

console.log("[MODULE:CONFIG] WORKING Init config.".working);
module.exports.BOT.BUILD_INFO.BUILD_STRING = module.exports.BOT.BUILD_INFO.BUILD_STRING.replace("VERSION", module.exports.BOT.BUILD_INFO.BUILD);
module.exports.EMBED.FOOTER.text = module.exports.EMBED.FOOTER.text.replace("VERSION", module.exports.BOT.BUILD_INFO.BUILD_STRING);
console.log("[MODULE:CONFIG] DONE Init config".success);