const { Given, When, Then, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { expect } = require('../../app/node_modules/chai');

Given('anonymous user can only read', async ()=> {
});

When('I sign in as anonymous', async ()=> {
});

When('I try to delete this event', async ()=> {
});

Then('I receive the error message {string}', async (message)=> {
    let actual = await World.robot.text("#error-message");
    expect(actual).to.equal(message);
});