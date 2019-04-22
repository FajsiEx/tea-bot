let expect = require("chai").expect;
let commandData = require("../modules/commandData");

describe('Data tests', () => {
    describe('Command data', () => {
        it('COMMANDS should be an array', () => {
            expect(Array.isArray(commandData.getCommands()));
        });
    });
});