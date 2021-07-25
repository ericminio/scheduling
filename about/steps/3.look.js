const { When, Then, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { By } = require('../../app/node_modules/selenium-webdriver');
const { markerPosition, getEventElements, getResourceElement, getEventScheduledWith } = require('./support');
const { expect } = require('../../app/node_modules/chai');

When('I look at the events', async ()=> {
    await World.driver.get('http://localhost:'+World.server.port+'/events');
    await World.driver.sleep(300);
});
Then('I see that {string} starts at {string}', async (label, time)=> {
    let position = await markerPosition(time);

    let candidates = await getEventElements(label);
    let found = candidates[0];
    let elementPosition = await found.getCssValue('left')
    
    expect(elementPosition).to.equal(position)
});
Then('I see that {string} ends at {string}', async (label, time)=> {
    let position = await markerPosition(time);

    let candidates = await getEventElements(label);
    let found = candidates[0];
    let elementPosition = await found.getCssValue('left')
    let elementWidth = await found.getCssValue('width')
    let actual = parseInt(elementPosition) + parseInt(elementWidth)
    let expected = parseInt(position)

    expect(Math.abs(actual-expected) < 2).to.equal(true)
});
Then('I see that {string} is scheduled with {string}', async (label, name)=> {
    let resourceElement = await getResourceElement(name);
    let eventsWithLabel = await getEventElements(label);
    let event = await getEventScheduledWith(resourceElement, eventsWithLabel);
    if (!event) {
        throw Error('nope')
    }
});
Then('he sees that the calendar is empty', async ()=> {
    let candidatesEvents = await World.driver.findElements(By.css('yop-calendar-event'));
    expect(candidatesEvents.length).to.equal(0);
});