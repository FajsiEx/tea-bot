const colors = require('colors');

module.exports = {
    init: function() {
        colors.setTheme({
            debug: 'grey',
            working: 'blue',
            success: 'green',
            warn: ['bgYellow', 'black'],
            error: 'red',

            interval: 'magenta',
            event: 'cyan',
            
            checkSuccess: 'bgGreen',
            checkFail: 'bgRed',
        });
    }
};