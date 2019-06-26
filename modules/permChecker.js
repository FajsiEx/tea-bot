module.exports = {
    admin: async function (messageEventData) {
        let msg = messageEventData.msg;

        if (!msg.member) { // If the msg is not in guild, user has every right to do shit
            return true;
        }

        if (msg.member.hasPermission('MANAGE_GUILD') || msg.member.hasPermission('ADMINISTRATOR')) {
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