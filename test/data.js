let expect = require("chai").expect;
let commandData = require("../handlers/command/commandData");
let generatorData = require("../sticky/generatorData");

describe('Data tests', () => {
    describe('Command data', () => {
        it('COMMANDS should be an array', () => {
            expect(Array.isArray(commandData.getCommands()));
        });
    });

    describe('Generator data', () => {
        it('generatorData should be an object', () => {
            expect(typeof(generatorData)).to.equal('object');
        });
        it('generatorData.generators should be an object', () => {
            expect(typeof(generatorData.generators)).to.equal('object');
        });
    });
});