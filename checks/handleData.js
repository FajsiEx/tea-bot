module.exports = {
    check: function(handleData) {
        let testStatus = module.exports.tests(handleData);

        if (testStatus) {
            console.log(("[CHECK:HANDLEDATA] Failed: " + testStatus).checkFail);
            return true;
        }else{
            console.log("[CHECK:HANDLEDATA] Passed.".checkSuccess);
            return false;
        }
    },

    tests: function(handleData) {
        if (!handleData) {return "handleData is false";}
        if (!handleData.msg) {return "handleData.msg is false";}
        return false;
    }
};