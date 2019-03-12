
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg) {
        msg.channel.send({
            "embed": {
                "title": "United by *Our Stolen Theory*",
                "color": COLORS.BLUE, // TODO: Move lyrics to consts module
                "description": `
Uni-uni-uni-uni-uni-uni-uni-uni-uni...
-ted-ted-ted-ted-ted-ted-ted-ted-ted...

No one gets left behind
This time there's no casualties 
This time I look the other way, other way

Get used to what's coming now
Is it all way too familiar
Is it what you want, you want?

We make it united
We make it united
We make it united
We make it united
We make it united
We make it united
We make it united
We make it united

Something new, we search
Something that varies from this all
Is it what you want, you want?

We get used to what's surrounding
That's all way too familiar
But that's not what you want, you want

One voice, united
We make the choices
One change, divided
We make it, united

One voice, united
We make the choices
One change, divided
We make it, united

We make it united
We make it united
We make it united
We make it united
We make it united
We make it united
We make it united
We make it united

Uni-uni-uni-uni-uni-uni-uni-uni-uni...

We make it united
We make it united
We make it united
We make it united
We make it united
We make it united
We make it united
We make it united

Oh it's you and me
And we're lost souls who get burned
Oh i'ts you and me
We just gotta be in love and learn

Oh it's you and me
And we're lost souls who get burned
Oh i'ts you and me
We just gotta be in love and learn

One voice, united
We make the choices
One change, divided
We make it, united
                `
            }
        });
    }
}