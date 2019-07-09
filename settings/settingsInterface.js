
const settingsTemplate = require("./settingsTemplate");

module.exports = {
    get: async function(settingName) {
        console.log(this.doesSettingExist(settingName));
    },

    doesSettingExist: function(settingName) {
        let settingTemplatesForGivenSettingName = settingsTemplate.filter((setting)=>{
            return setting.name == settingName;
        });

        return (settingTemplatesForGivenSettingName.length < 1) ? false : settingTemplatesForGivenSettingName;
    }
};