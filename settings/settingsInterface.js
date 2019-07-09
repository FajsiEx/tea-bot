
const settingsTemplate = require("./settingsTemplate");
const dbInt = require("../db/interface");

module.exports = {
    get: async function(guildId, settingName) {
        let settingTemplate = this.getSettingTemplate(settingName);
        if (!settingTemplate) {throw("Unknown settings. Please check if the setting exists in settingsTemplate.");}

        let guildDoc;
        try {
            guildDoc = await dbInt.getGuildDoc(guildId);
        }catch(e){
            throw("Failed to get guildDoc: " + e);
        }

        if (!guildDoc.settings) {guildDoc.settings = [];} // If settings array doesn't exist in the guildDoc, simulate an empty array.

        if (guildDoc.settings[settingName]) {
            return guildDoc.settings[settingName];
        }else{
            return settingTemplate.defaultValue;
        }
    },

    getSettingTemplate: function(settingName) {
        let settingTemplatesForGivenSettingName = settingsTemplate.filter((setting)=>{
            return setting.name == settingName;
        });

        return settingTemplatesForGivenSettingName[0];
    }
};