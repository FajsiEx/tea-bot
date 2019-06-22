module.exports = {
    admin: (handleData) => {
        return new Promise((resolve) => {
            let msg = handleData.msg;

            if (!msg.member) { // If the msg is not in guild, user has every right to do shit
                resolve(true);
            }

            if (msg.member.hasPermission('MANAGE_GUILD') || msg.member.hasPermission('ADMINISTRATOR')) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    },

    dev: (userID) => {
        return new Promise((resolve) => {
            if (userID == 342227744513327107) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
};