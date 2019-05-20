module.exports = {
    admin: (handleData) => {
        return new Promise((resolve, reject) => {
            let msg = handleData.msg;

            if (msg.member.hasPermission('MANAGE_GUILD') || msg.member.hasPermission('ADMINISTRATOR')) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    },

    dev: (handleData) => {
        return new Promise((resolve, reject) => {
            if (handleData.msg.author.id == 342227744513327107) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
};