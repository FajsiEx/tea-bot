/*

    Intentional reject.

*/

module.exports = {
    handler: async function(handleData) {
        let andTestingTimes = (Math.random()*100) % 32;

        throw(`Intentional reject. This command module is meant for error tracking testing${" and testing".repeat(andTestingTimes)}.`);
    }
};
