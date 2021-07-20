const { After, World } = require('../../app/node_modules/@cucumber/cucumber/lib');

After(async (testCase)=>{
    await World.driver.quit();
    await World.server.stop();
});