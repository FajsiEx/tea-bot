let expect = require("chai").expect;
let stickyCtrl = require("../sticky/stickyController");
const CONFIG = require("../modules/config");

describe('Sticky', () => {
    describe('Controller', () => {
        it('Hash', () => {
            let testMessageData = {
                "embed": {
                    "title": "Test",
                    "color": CONFIG.EMBED.COLORS.STICKY,
                    "description": `
                        Test data
                    `,
                    "footer": CONFIG.EMBED.FOOTER()
                }
            }
            expect(stickyCtrl.hashMsgData(testMessageData)).to.equal('eb9149fab66e6ad35dd0024c79f13709');
        });
    });
});