let globalTemplate = {
    usersObj: {},
    events: [],
    dp: false, // dp object - false if no dp

    logData: [],

    eventsCounter: 0,
    teas: 0,
    commandsServed: 0,

    startTime: 0,
    lastSaveTime: 0,

    modModeOn: false,
    disableStatus: false, // If true auto status will be disabled

    vc: false, // will be removed and unused
    musicConnections: {test: "test"},

    dynamicNickUpdates: false,
    bestRanks: {
        fx:     false,
        cody:   false
    }
};

let global = {};

let disableAutoSave = false;

dbModule = require("./db");

module.exports = {
    get: (varName)=>{
        console.log(`[GV_GET] Getting [${varName}]`.debug);
        if (!global[varName]) {
            if (globalTemplate[varName]) {
                console.log(`Var [${varName}] found in template. Returning that.`.info);
                return globalTemplate[varName];
            }
            console.log(`Var [${varName}] is false and not found in template. You should add it.`.warn);
            return false;
        }
        return global[varName];
    },

    set: (varName, value)=>{
        console.log(`[GV_SET] Setting [${varName}]`.debug);
        console.dir(value);
        global[varName] = value;
        return true;
    },

    init: ()=>{ // Inits this module - loads data from database and sets timer to auto-save data.
        console.log(`[GV_INIT] Initing...`.debug);
        dbModule.load().then((data)=>{
            console.log(`[GV_INIT] Loaded init.`.success);

            if (Object.keys(data).length <= 2) { // If the db is empty leave and wait for auto save to write the default values.
                console.log("[GV_INIT] Empty load. Returning.".warn);
                return;
            }

            global = data;

            if (new Date().getTime() - data.lastSaveTime < 10000) {
                disableAutoSave = true;
                console.log("[GV_INIT] Overlap load. Auto-saving is disabled. Restart manually to reset.".warn);
                return;
            }
        });
        console.log(`[GV_INIT] Setting interval...`.debug);
        setInterval(()=>{ // Does this every 10 seconds
            console.log("[AUTOSAVE] Autosaving data...".interval);

            if ((global.lastSaveTime + 10*1000) - new Date().getTime() > 0) {
                console.log(`[AUTOSAVE] Autosave save limit protection. ${(global.lastSaveTime + 10*1000) - new Date().getTime()}ms until next autosave can be made. Force-save does not have this limit`.warn);
                return;
            }
            if (disableAutoSave) {
                console.log("[AUTOSAVE] Autosave is disabled for some reason. Most likely it's in the first few lines of logs.".info);
                return;
            }
            dbModule.save(global);
            global.lastSaveTime = new Date().getTime();
        }, 10 * 1000);
    },

    fLoad: ()=>{
        console.log(`[GV_FLOAD] Force loading...`.debug);
        dbModule.load().then((data)=>{
            console.log(`[GV_FLOAD] Loaded.`.success);
            global = data;
        });
    },
    fSave: ()=>{
        console.log(`[GV_FSAVE] Force saving...`.debug);
        dbModule.save(global);
        global.lastSaveTime = new Date().getTime();
        console.log(`[GV_FSAVE] Saved.`.success);
    },
    dump: ()=>{
        console.log(`[GV_DUMP] Dumping...`.debug);
        return JSON.stringify(global);
    }
};