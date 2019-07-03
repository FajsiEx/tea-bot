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
    {
        keywords: ["correctcommand"],
        type: "plain",
        data: "HAHAHAAHAHA so fucking funny. Fuck off, will ya?"
    },
    {
        keywords: ["rip"],
        type: "plain",
        data: "Rest in piss, forever miss..."
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
    {
        keywords: ["gtg"],
        type: "random",
        data: [
            "Cya!",
            "Bye bye!"
        ]
    },


    //* FILE
    {
        keywords: ["explosion"],
        type: "file",
        data: "https://media.giphy.com/media/XUFPGrX5Zis6Y/giphy.gif"
    }
];