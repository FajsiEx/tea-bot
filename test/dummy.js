let expect = require("chai").expect;

describe("Dummy tests", ()=>{
    describe("Add", ()=>{
        it("adds 1 and 1", ()=>{
            expect(1 + 1).to.equal(2);
        });
    });
    describe("Subtract", ()=>{
        it("subtracts 2 and 1", ()=>{
            expect(2 - 1).to.equal(1);
        });
    });
    describe("Multiply", ()=>{
        it("multiplies 6 and 9", ()=>{
            expect(6 * 9).to.equal(54);
        });
    });
    describe("Divide", ()=>{
        it("divides 60 by 6", ()=>{
            expect(60 / 6).to.equal(10);
        });
    });
});