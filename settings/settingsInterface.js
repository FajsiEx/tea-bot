
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

        if (!guildDoc.settings) {guildDoc.settings = {hasSettings: true};} // If settings object doesn't exist in the guildDoc
        if (!guildDoc.settings.hasSettings) {guildDoc.settings = {hasSettings: true};}

        if (guildDoc.settings[settingName]) {
            return guildDoc.settings[settingName];
        }else{
            guildDoc.settings[settingName] = settingTemplate.defaultValue;
            return settingTemplate.defaultValue;
        }
    },

    set: async function(guildId, settingName, settingValue) {
        let guildDoc;
        try {
            guildDoc = await dbInt.getGuildDoc(guildId);
        }catch(e){
            throw("Failed to get guildDoc: " + e);
        }

        if (!guildDoc.settings) {guildDoc.settings = {hasSettings: true};} // If settings object doesn't exist in the guildDoc
        if (!guildDoc.settings.hasSettings) {guildDoc.settings = {hasSettings: true};}
        // TODO: add perm checks
        
        guildDoc.settings[settingName] = settingValue;
    },

    getSettingTemplate: function(settingName) {
        let settingTemplatesForGivenSettingName = settingsTemplate.filter((setting)=>{
            return setting.name == settingName;
        });

        return settingTemplatesForGivenSettingName[0];
    }
};