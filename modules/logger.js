/*

    Better than console.log();

*/

let logData = [];

let compareReverse = (a,b)=>{
    if (a.time > b.time) {
        return -1;
    }else if (a.time < b.time) {
        return 1;
    }else{
        return 0;
    }
}

module.exports = {
    log: (type, data)=>{
        console.log(`[LOGGER] /${type}/ : ${data}`)
        logData.push({
            time: new Date().getTime(),
            type: type,
            data: data
        });
    },

    getLogs: ()=>{
        logData.sort(compareReverse);
        return logData;
    }
}