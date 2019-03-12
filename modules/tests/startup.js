
let testStartTime = 0;

module.exports = ()=>{
    console.log("[TEST] Running startup test...".info);
    testStartTime = new Date().getTime();

    if (!process.env.DATABASE_URI) {
        console.error("[TEST] Startup test failed. DATABASE_URI false. VALUE:" + process.env.DATABASE_URI);
        return false;
    }
    if (!process.env.DISCORD_BOT_TOKEN) {
        console.error("[TEST] Startup test failed. DISCORD_BOT_TOKEN false. VALUE:" + process.env.DISCORD_BOT_TOKEN);
        return false;
    }
    if (!process.env.GAPI) {
        console.error("[TEST] Startup test failed. GAPI false. VALUE:" + process.env.GAPI);
        return false;
    }
    if (!process.env.OWMAPI) {
        console.error("[TEST] Startup test failed. OWMAPI false. VALUE:" + process.env.OWMAPI);
        return false;
    }

    console.log(`[TEST_PASS] Startup test passed in ${new Date().getTime() - testStartTime}ms.`.success);
    return true;
};