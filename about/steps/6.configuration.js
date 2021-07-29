const { Given, When, Then, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { expect } = require('../../app/node_modules/chai');
const { openConfiguration } = require('./navigation');

When('he modifies the title to {string}', async (value)=> {
    await World.robot.input('#configuration-title', value);
    await World.robot.click('#save-configuration');
});

When('he modifies the opening hours to {string}', async (value)=> {
    await World.robot.input('#configuration-opening-hours', value);
    await World.robot.click('#save-configuration');
});
