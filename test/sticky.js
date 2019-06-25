require('sexy-require'); // For those nice absolute paths

let expect = require("chai").expect;
let stickyCtrl = require("../sticky/stickyController");
const CONFIG = require("../modules/config");


describe('Sticky', () => {
    describe('Controller', () => {
        it('Hash', () => {
            let testHashData = "test data wwwww";
            expect(stickyCtrl.hashMsgData(testHashData)).to.equal('77ce80484b4ddd51b3937329bd5fd9af');
        });
    });
});