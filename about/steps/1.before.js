const { Before, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { Builder, By } = require('../../app/node_modules/selenium-webdriver');
const clear = require('../../app/storage/migrations/clear');
const code = require('fs').readFileSync(require('path').join(__dirname, 'robot.js')).toString();
const Robot = (new Function(`${code}; return Robot`))();

Before(async (testCase)=>{
    let maybeLoaded = require.resolve('../../app/start');
    delete require.cache[maybeLoaded];
    let { server, database } = require('../../app/start');
    World.server = server;
    await clear(database);
    World.driver = await new Builder().forBrowser('firefox').build();
    World.robot = new Robot(World, By);
});
