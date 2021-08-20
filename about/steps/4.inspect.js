const { Given, When, Then, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { markerPosition, getEventElements, getResourceElement, getEventScheduledWith } = require('./support');
const { expect } = require('../../app/node_modules/chai');

When('I inspect event {string} scheduled with {string}', async (label, name)=> {
    let resourceElement = await getResourceElement(name);
    let eventsWithLabel = await getEventElements(label);
    let event = await getEventScheduledWith(resourceElement, eventsWithLabel);
    event.click();
});
Then('I see that this event start is {string}', async (expected)=> {
    let element = await World.robot.findElement('#event-info-start');
    let actual = await element.getAttribute('value');
    expect(actual).to.equal(expected);
});
Then('I see that this event end is {string}', async (expected)=> {
    let element = await World.robot.findElement('#event-info-end');
    let actual = await element.getAttribute('value');
    expect(actual).to.equal(expected);
});
When('I inspect resource {string}', async (name)=> {
    let resourceElement = await getResourceElement(name);
    await resourceElement.click();
});
Then('I see that this resource type is {string}', async (type)=> {
    let element = await World.robot.findElement('#resource-info-type');
    let actual = await element.getAttribute('value');
    expect(actual).to.equal(type);
});
Then('he sees the notes for this event are {string}', async (notes)=> {
    let element = await World.robot.findElement('#event-info-notes');
    let actual = await element.getAttribute('value');
    expect(actual).to.equal(notes);
});