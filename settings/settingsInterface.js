
const settingsTemplate = require("./settingsTemplate");
const dbInt = require("../db/interface");
const permChecker = require("../modules/permChecker");

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

    set: async function(guildId, settingName, settingValue, member) {
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

        if (settingTemplate.perm == "dev") {
            let isDev;
            try {
                isDev = await permChecker.dev(member.user.id);
            }catch(e){
                throw("Dev perm check rejected: " + e);
            }

            if (!isDev) {
                return "insufPerm";
            }
        }
        if (settingTemplate.perm == "admin") {
            let isAdmin;
            try {
                isAdmin = await permChecker.admin(member);
            }catch(e){
                throw("Admin perm check rejected: " + e);
            }

            if (!isAdmin) {
                return {error: "perm", minimalPerm: settingTemplate.perm};
            }
        }
        
        try {
            settingValue = this.parseValueToCorrectType(settingTemplate, settingValue);
        }catch(e){
            return {error: "type", settingType: settingTemplate.type};
        }

        guildDoc.settings[settingName] = settingValue;

        return {success:true};
    },

    getSettingTemplate: function(settingName) {
        let settingTemplatesForGivenSettingName = settingsTemplate.filter((setting)=>{
            return setting.name == settingName;
        });

        return settingTemplatesForGivenSettingName[0];
    },

    parseValueToCorrectType: function(settingTemplate, settingValue) {
        switch (settingTemplate.type) {
            case "bool":
                if (settingValue === "true") { return true; }
                else if (settingValue === "false") { return false; }
                else {throw("Invalid value for bool type");}
            case "int":
                settingValue = settingValue.parseInt();
                if (!settingValue) {throw("Invalid value for int type");}
            case "string":
                return settingValue;
            default:
                throw("Setting type the setting uses is not valid");
        }
    }
};