let expect = require("chai").expect;

describe("Number operations", ()=>{
    describe("Add", ()=>{
        it("adds 1 and 1", ()=>{
            expect(1 + 1).to.equal(2);
        });
        it("adds 69 and 420", ()=>{
            expect(69 + 420).to.equal(489);
        });
    });
});