module.exports = {
    admin: async function (member) {

        if (!member) { // If the msg is not in guild, user has every right to do shit
            return true;
        }

        if (member.hasPermission('MANAGE_GUILD') || member.hasPermission('ADMINISTRATOR')) {
            return true;
        } else {
            return false;
        }
    },

    dev: async function (userID) {
        if (userID == 342227744513327107) {
            return true;
        } else {
            return false;
        }
    }
};