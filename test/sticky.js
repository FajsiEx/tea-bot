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
            expect(stickyCtrl.hashMsgData(testMessageData)).to.equal('b43892a52c1f318cf0ac2190e02f769c');
        });
    });
});