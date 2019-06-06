const colors = require('colors');

module.exports = {
    init: function() {
        colors.setTheme({
            debug: 'grey',
            info: 'blue',
            working: 'blue',
            success: 'green',
            special: ['bgBlue', 'black'],
            warn: ['bgYellow', 'black'],
            error: 'red',

            interval: 'magenta',
            event: 'cyan',
            
            checkSuccess: 'bgGreen',
            checkFail: 'bgRed',
        });
    }
};