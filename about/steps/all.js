const { Before, After, Given, When, Then, World } = require('../../app/node_modules/@cucumber/cucumber');
const { Builder, By } = require('../../app/node_modules/selenium-webdriver')
const { expect } = require('../../app/node_modules/chai')

Before(async (testCase)=>{
    let maybeLoaded = require.resolve('../../app/start');
    delete require.cache[maybeLoaded];
    World.server = require('../../app/start');
    World.driver = await new Builder().forBrowser('firefox').build();
});
After(async (testCase)=>{
    await World.driver.quit();
    await World.server.stop();
});

Given('the following resources exist in the system', function (resources) {
});
Given('the following events', function (events) {
});
Given('I look at the events grouped by {string}', async (type)=> {
    await World.driver.get('http://localhost:'+World.server.port+'/events');
});
When('I move event {string} to start at {string}', function (id, start) {
});
Then('I see that event {string} starts at {string}', async (id, expected)=> {
    let element = await World.driver.findElement(By.css("#event-"+id))
    let actual = await element.getAttribute('data-start')
    expect(actual).to.equal(expected)
});
Then('I see that event {string} ends at {string}', async (id, expected)=> {
    let element = await World.driver.findElement(By.css("#event-"+id))
    let actual = await element.getAttribute('data-end')
    expect(actual).to.equal(expected)
});
