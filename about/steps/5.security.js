const { Given, When, Then, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { getEventElements, getResourceElement, getEventScheduledWith } = require('./support');
const { expect } = require('../../app/node_modules/chai');
const login = require('./login')
const { openEvents } = require('./navigation')
const { User } = require('../../app/domain')

Given('the following users and privileges', async (table)=> {
    let lines = table.rawTable;
    for (let i=1; i<lines.length; i++) {
        let data = lines[i];
        let username = data[0];
        let password = data[1];
        let privileges = data[2];
        let user = new User({ username:username, password:password, privileges:privileges });
        await World.server.services['users'].save(user);
    }
});

When('{string} signs in with password {string}', async (username, password)=> {
    await login(username, password);
});

When('he inspects event {string} scheduled with {string}', async (label, name)=> {
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