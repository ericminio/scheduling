const { When, Then, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { expect } = require('../../app/node_modules/chai');
const { Configuration } = require('../../app/domain')
const { openConfiguration } = require('./navigation')

When('he navigates to configuration', async ()=> {
    await openConfiguration();
});

When('he modifies the title to {string}', async (value)=> {
    await World.robot.input('#configuration-title', value);
    await World.robot.click('#save-configuration');
});

Then('he sees that the header displays {string}', async (expected)=> {
    let actual = await World.robot.text('#title');
    expect(actual).to.equal(expected);
});