/*

    Defines smaller functions that don't need their own module for each one.

*/

module.exports = {
    compare: (a,b)=>{
        if (a.time < b.time) {
            return -1;
        }else if (a.time > b.time) {
            return 1;
        }else{
            return 0;
        }
    },

    checkAdmin: (msg)=>{
        return false;
        if(msg.member.roles.some(r=>[
            "admin",
            "owner",
            "mod",
            "moderator",
            "hokage"
        ].includes(r.name.toLowerCase()))) {
            return true;
        }else{
            return false;
        }
    },

    secondsToTimeString: (seconds)=>{
        minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        return `${minutes}m ${seconds}s`;
    },

    dateToDateString: (dateObj, dateParserFriendly)=>{
        if (dateParserFriendly) {
            return `${dateObj.getMonth()+1}.${dateObj.getDate()}.${dateObj.getFullYear()}`;
        }else{
            return `${dateObj.getDate()}.${dateObj.getMonth()+1}.${dateObj.getFullYear()}`;
        }
        
    }
};