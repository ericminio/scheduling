const { Given, When, Then, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { getEventElements, getResourceElement, getEventScheduledWith } = require('./support');
const { expect } = require('../../app/node_modules/chai');
const login = require('./login')
const { openEvents } = require('./navigation')

Given('the following users and priviledges', async (dataTable)=> {
});

When('{string} signs in with password {string}', async (username, password)=> {
    await login(username, password);
});

When('he inspects event {string} scheduled with {string}', async (label, name)=> {
    await openEvents();
    let resourceElement = await getResourceElement(name);
    let eventsWithLabel = await getEventElements(label);
    let event = await getEventScheduledWith(resourceElement, eventsWithLabel);
    event.click();
});

When('he tries to delete this event', async ()=> {
    let action = await World.robot.findElement('#delete-event');
    action.click(); 
});

Then('he receives the error message {string}', async (message)=> {
    let actual = await World.robot.text("#error-message");
    expect(actual).to.equal(message);
});