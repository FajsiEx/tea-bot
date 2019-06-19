require('sexy-require'); // For those nice absolute paths

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
                    `
                }
            }
            expect(stickyCtrl.hashMsgData(testMessageData)).to.equal('aafcda27704dcad375fa05b8131c0927');
        });
    });
});