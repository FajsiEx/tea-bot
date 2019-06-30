/*

    Quick response data

    Array that stores data similarly to commandData

*/


// TODO: add embed type reply
module.exports = [
    //* PLAIN
    {
        keywords: ["oof"],
        type: "plain",
        data: "Oof haha"
    },
    {
        keywords: ["aquaisfuckinguseless"],
        type: "plain",
        data: "https://www.youtube.com/watch?v=cRsSDCY6Z58"
    },
    {
        keywords: ["congrats", "congratulations"],
        type: "plain",
        data: "🎉🎉🎉🎉🎉🎉🎉🎉🎉"
    },

    //* RANDOM
    {
        keywords: ["hi", "hello"],
        type: "random",
        data: [
            "Hi!",
            "Hello!",
            "こんにちは!"
        ]
    },


    //* FILE
    {
        keywords: ["explosion"],
        type: "file",
        data: "https://media.giphy.com/media/XUFPGrX5Zis6Y/giphy.gif"
    }
];