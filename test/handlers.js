let expect = require("chai").expect;
let msgHandler = require("../handlers/message");

describe('Handler tests', () => {
    describe('Message handler', () => {
        it('Starts with prefix [!]', () => {
            expect(msgHandler.stringStartsWithPrefix("!string")).to.equal("!");
        });
        it('Starts with prefix [tea!]', () => {
            expect(msgHandler.stringStartsWithPrefix("tea!string")).to.equal("tea!");
        });
        it('Starts with prefix [#] (should return false)', () => {
            expect(msgHandler.stringStartsWithPrefix("#string")).to.equal(undefined);
        });
        it('Starts with prefix [] (empty)', () => {
            expect(msgHandler.stringStartsWithPrefix("string")).to.equal(undefined);
        });
    });
});