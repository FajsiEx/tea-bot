
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg) {
        msg.channel.send({
            "embed": {
                "title": "Techno kitty by *S3RL*",
                "color": COLORS.BLUE,
                "description": `
Up in the sky
Flyiiing way up high
I can't beliieve my eyes
A techno feeeline
so fly
Up high
And neeeveer come down
I'll move
Like you
To the techno sound

***TECHNO CAT***

Techno kitty, kitty
You're so pretty kitty
Techno Kitty with a rocket pack
Techno kitty, kitty
You're so pretty kitty
Techno Kitty with wings on your back
Flying through the air so high
You're like a shooting star that lights up the sky
Techno kitty, kitty
You're so pretty kitty
Techno kitty
Tec-tec-techno cat
***TECHNO CAT***
How?
*Hooow?*
How'd you get there
Way up in the air
You're souring so free
Cute fluffy kitty
So fly
Up high
And neeeveer come down
I'll move
Like you
To the techno sound
***TECHNO CAT***
Techno kitty, kitty
You're so pretty kitty
Techno Kitty with a rocket pack
Techno kitty, kitty
You're so pretty kitty
Techno Kitty with wings on your back
Flying through the air so high
You're like a shooting star that lights up the sky
Techno kitty, kitty
You're so pretty kitty
Techno kitty
Tec-tec-techno cat
***TECHNO CAT***
How?
*Hooow?*
                `
            }
        });
    }
}