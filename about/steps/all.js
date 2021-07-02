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
Then('I see that event {string} starts at {string}', async (id, time)=> {
    let markerSelector = '#hour-' + time.replace(':', '');
    let marker = await World.driver.findElement(By.css(markerSelector))
    let markerPosition = await marker.getCssValue('left')
    let element = await World.driver.findElement(By.css("#event-"+id))
    let elementPosition = await element.getCssValue('left')
    
    expect(elementPosition).to.equal(markerPosition)
});
Then('I see that event {string} ends at {string}', async (id, time)=> {
    let markerSelector = '#hour-' + time.replace(':', '');
    let marker = await World.driver.findElement(By.css(markerSelector))
    let markerPosition = await marker.getCssValue('left')
    let element = await World.driver.findElement(By.css("#event-"+id))  
    let elementPosition = await element.getCssValue('left')
    let elementWidth = await element.getCssValue('width')
    let actual = parseInt(elementPosition) + parseInt(elementWidth)
    let expected = parseInt(markerPosition)

    expect(actual).to.equal(expected)
});
