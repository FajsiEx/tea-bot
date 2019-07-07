const colors = require('colors');

module.exports = {
    init: function() {
        colors.setTheme({
            debug: 'grey',
            info: 'blue',
            working: 'blue',
            success: 'green',
            special: ['bgBlue', 'black'],
            subspecial: ['blue', 'italic'],
            warn: ['bgYellow', 'black'],
            error: 'red',
            critError: ['bgRed', 'black'],

            interval: 'magenta',
            event: 'cyan',
            
            checkSuccess: 'bgGreen',
            checkFail: 'bgRed',
        });
    }
};