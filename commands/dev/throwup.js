/*

    Intentional reject.

*/

module.exports = {
    handler: async function() {
        throw(`Intentional reject. おまえは もう しんでいる`);
    }
};
