module.exports = {
    check: function(handleData, canSafelyFail) {
        let testStatus = module.exports.tests(handleData);

        if (testStatus) {
            if (canSafelyFail) {
                console.log(("[CHECK:HANDLEDATA] Failed safely: " + testStatus).warn);
            }else{
                console.log(("[CHECK:HANDLEDATA] Failed: " + testStatus).checkFail);
            }
            return true;
        }else{
            console.log("[CHECK:HANDLEDATA] Passed.".checkSuccess);
            return false;
        }
    },

    tests: function(handleData) {
        if (!handleData) {return "handleData is false";}
        if (!handleData.msg) {return "handleData.msg is false";}
        if (!handleData.dClient) {return "handleData.dClient is false";}
        return false;
    }
};