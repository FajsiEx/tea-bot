/*

    Generates a semi-unique ID for a handle

    x = last 2 digits of user id
    y = minutes
    z = seconds

*/

const handleDataCheck = require("../checks/handleData");

module.exports = {
    generate: function(msg) {

        let x = msg.author.id.toString();
        x = parseInt(x.slice(x.length - 2));
        let y = new Date().getMinutes();
        let z = new Date().getSeconds();

        let r = Math.floor((Math.random()*100) % 4090) + 1; // Impossible to get 0xFFF since 0xFFF is 4095

        x = x.toString(16);
        y = y.toString(16);
        z = z.toString(16);
        r = r.toString(16);

        x = (x.length < 2) ? "0" + x : x;
        y = (y.length < 2) ? "0" + y : y;
        z = (z.length < 2) ? "0" + z : z;

        switch (r.length) {
            case 1:
                r = "00"+r; break;
            case 2:
                r = "0"+r; break;
        }

        let finalValue = r + x + y + z;

        return finalValue;
    }
}; 