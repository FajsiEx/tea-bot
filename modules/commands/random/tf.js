
module.exports = {
    command: function(msg) {
        let rolled = Math.floor(Math.random() * 100);

        if (rolled <= 50) {
            rolled = "nie";
        }else{
            rolled = "áno";
        }

        msg.reply(rolled);
    }
}