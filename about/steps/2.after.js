const { AfterAll, After, World } = require('../../app/node_modules/@cucumber/cucumber/lib');

After(async (testCase)=>{
    await World.server.stop();
});

AfterAll(async ()=>{
    await World.driver.quit();
});