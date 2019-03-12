/*

    Constant variables.

*/

let afterVerString = "";

if (process.env.DISABLE_SAVE == "yes") {
    afterVerString = " [BETA]";
}

module.exports = {
    VERSION: "19.3.2" + afterVerString,

    WEEK_DAYS: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"],
    WEEK_DAYS_SHORT: ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"],

    RESTRICTED_MODE: false,

    TEST_CHANNEL_ID: 514873440159793167,

    DEV_USERID: "342227744513327107",

    discordBotConfig: {
        token: process.env.DISCORD_BOT_TOKEN,
        prefix: "!" // Prefix for the bot commands
    },

    COLORS: {
        RED: 16720418,
        YELLOW: 14540032,
        BLUE: 1616639,
        PINK: 13041919,
        GREEN: 4521796
    },

    HOLIDAYS: [
        {
            name: "Jarné prázdniny",
            date: new Date("02/23/2019 00:00:00 GMT+0100")
        },
        {
            name: "Veľkonočné prázdniny",
            date: new Date("04/18/2019 00:00:00 GMT+0100")
        },
        {
            name: "Maturita 2019",
            date: new Date("03/12/2019 00:00:00 GMT+0100")
        },
        {
            name: "Letné prázdniny",
            date: new Date("06/29/2019 00:00:00 GMT+0100")
        },
        {
            name: "Maturita 2022",
            date: new Date("03/12/2022 00:00:00 GMT+0100")
        },
    ],

    SUBJECTS: ["STN", "MAT", "AJ", "ZEQ", "PRO", "FYZ", "DEJ", "INF", "OBN", "ZER", "MECH"],

    TIMETABLE: [
        ['Víkend'],
        ['Stn', 'Mat', 'Aj/Tsv', 'Zeq', 'ProP/Aj', 'Fyz', 'Sjl'],
        ['Dej', 'Inf', 'Inf', 'Stn(K)/Aj', 'ZeqC/Mat', 'Obn', 'Aj/Zeq(C)'],
        ['Nbv', 'Zeq', 'Zer', 'Zer', 'Pro', 'Tsv/Pro(P)', 'Mat/Stn(K)', 'Mech'],
        ['Prax', 'Prax', 'Prax', 'Mat/Sjl', 'Sjl/Mat', 'Sjl'],
        ['Stn', 'Zeq', 'Fyz/Tsv', 'Aj', 'Mat', 'Tsv/Fyz', 'Etv'],
        ['Víkend'],
    ],

    JOKES: [ // Credits to Dan Valnicek
        `Spýtal som sa mojej dcéry, či by mi podala noviny. Povedala mi, že noviny sú stará škola. Povedala, že ľudia dnes používajú tablety a podala im iPad. Mucha nemala šancu.`,
        `Vždy som si myslela, že moji susedia sú celkom milí ľudia. Ale potom si dali heslo na Wi-Fi.`,
        `Pred dvoma rokmi som sa pozval dievča svojich snov na rande, dnes som ju požiadal o ruku.
        Obidva krát povedala nie.`,
        `"Mami, neľakaj sa, ale som v nemocnici."
        "Synu, prosím ťa. Si tam chirurg už 8 rokov. Môžeme začať naše telefonáty inak?"`,
        `Muž hovorí žene: "Vieš, čim chce byť náš 6-ročný syn, keď bude veľký?"
        Manželka: "Nie"
        Muž: "Smetiarom. A vieš prečo? "
        Manželka: "Nie, prečo?"
        Muž: "Pretože si myslí, že pracujú iba v utorok."`,
        // haha jokes
        `Stretnú sa dvaja povaľači. Prvý sa tak zamyslí a vraví:
        - Človeče, keby nebol ten INTERNET, sedel by som celý deň pri telke!`,
        `Čo znamená názov systému WINDOWS? Nenechajte sa oblafnúť, že Microsoftu ide o nejaké okná. V skutočnosti ide o akronym z posledných slov indiánskeho náčelníka sediaceho býka, ktoré povedal vo svojom rodnom siouxskom nárečí. V slovenskom preklade veštba znie:
        "Zvíťazí Biely Muž Čumiaci Na Presýpacie Hodiny!"`,
        `- Viete, ako sa prežehnáva počítačový fanatik?
        - V mene otca i syna, i ducha enter.`,
        `Ide programátor o 18.00 z práce a stretne šéfa, ktorý sa ho pýta: 
        - Čo ty tak zavčasu? Zobral si si pol dňa dovolenky? 
        - Nie, len si skočím na obed.`,
        `- Viete, ako sa povie Linux po španielsky?
        - Adios BIOS.`,
        `Život by bol jednoduchší, keby sme k nemu mali zdrojový kód.`,
        `Programátor hovorí programátorovi:
        - Moja babka má dnes 64 rokov.
        - Že gratulujem k peknému okrúhlemu výročiu...`,
        //Cody's jokes
        "Čo si dáva kulturista v kaviarni? Benchpresso s mliekom",
        "Viete aké auto vyhralo cenu za najlepšie auto roku 2018 podľa magazínu EVA?.....To modré",
        "Ako sa volá miesto, kde hromadne zomierajú mačky? Mňauschwitz",
        "Ako sa volá strážny pes čo nešteká? Mlčiak",
        "Ako Freddie Mercury dostal AIDS? Len tak, z prdele"
    ],

    OWO_DM_REPLY_MSGS: [
        "Fucking kill me.",
        "Stop it. Get some help.",
        "Don't owo me, baka~~~~ >_<",
        "My disappointment is immeasurable and my day is ruined. Because of you.",
        "Don't you fucking dare do that again."
    ],

    NAMEDAYS: {
        1: {
            16: "Gordii",
            30: "Emma"
        },
        2: {
            24: "Matej",
            26: "Viktor",
            27: "Alex"
        },
        3: {
            7: "Tomáš"
        },
        4: {
            8: "Albert"
        },
        6: {
            7: "Robo",
            29: "Peťo"
        },
        7: {
            6: "Patrik",
            21: "Daniel",
            25: "Jakub"
        },
        9: {
            24: "Ľuboš",
            29: "Michal"
        },
        10: {
            15: "Tez",
            18: "Lukáš",
            30: "Šimon"
        },
        11: {
            11: 'Martin & Maros'
        },
        12: {
            17: "Nela",
            30: "Dávid"
        }
    }
};