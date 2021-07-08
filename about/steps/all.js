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
Then('I see that {string} starts at {string}', async (label, time)=> {
    let markerSelector = '#hour-' + time.replace(':', '');
    let marker = await World.driver.findElement(By.css(markerSelector))
    let markerPosition = await marker.getCssValue('left')

    let candidates = await World.driver.findElements(By.css('yop-calendar-event'));
    let found;
    for (let i=0; i<candidates.length; i++) {
        let candidate = candidates[i];
        let text = await candidate.getText();
        if (text == label) {
            found = candidate;
            break;
        }
    }
    let id = await found.getAttribute('id');

    let element = await World.driver.findElement(By.css("#"+id))
    let elementPosition = await element.getCssValue('left')
    
    expect(elementPosition).to.equal(markerPosition)
});
Then('I see that {string} ends at {string}', async (label, time)=> {
    let markerSelector = '#hour-' + time.replace(':', '');
    let marker = await World.driver.findElement(By.css(markerSelector))
    let markerPosition = await marker.getCssValue('left')

    let candidates = await World.driver.findElements(By.css('yop-calendar-event'));
    let found;
    for (let i=0; i<candidates.length; i++) {
        let candidate = candidates[i];
        let text = await candidate.getText();
        if (text == label) {
            found = candidate;
            break;
        }
    }
    let id = await found.getAttribute('id');

    let element = await World.driver.findElement(By.css("#"+id))  
    let elementPosition = await element.getCssValue('left')
    let elementWidth = await element.getCssValue('width')
    let actual = parseInt(elementPosition) + parseInt(elementWidth)
    let expected = parseInt(markerPosition)

    expect(actual).to.equal(expected)
});
Then('I see that {string} is scheduled with {string}', async (eventLabel, resourceName)=> {
    let candidatesResources = await World.driver.findElements(By.css('yop-calendar-resource'));
    let foundResource;
    for (let i=0; i<candidatesResources.length; i++) {
        let candidate = candidatesResources[i];
        let text = await candidate.getText();
        if (text == resourceName) {
            foundResource = candidate;
            break;
        }
    }
    let resourceId = await foundResource.getAttribute('id');
    let resourceSelector = '#' + resourceId;
    let resource = await World.driver.findElement(By.css(resourceSelector));
    let resourcePosition = await resource.getCssValue('top');

    let candidatesEvents = await World.driver.findElements(By.css('yop-calendar-event'));
    let foundEvent;
    for (let i=0; i<candidatesEvents.length; i++) {
        let candidate = candidatesEvents[i];
        let text = await candidate.getText();
        if (text == eventLabel) {
            foundEvent = candidate;
            break;
        }
    }
    let eventId = await foundEvent.getAttribute('id');
    let element = await World.driver.findElement(By.css("#"+eventId));
    let elementPosition = await element.getCssValue('top');

    expect(elementPosition).to.equal(resourcePosition);
});
