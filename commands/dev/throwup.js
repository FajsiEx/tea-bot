/*

    Intentional reject.

*/

module.exports = {
    handler: async function(handleData) {
        throw(`Intentional reject. おまえは もう しんでいる`);
    }
};
