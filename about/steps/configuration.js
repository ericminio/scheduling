const { When, Then, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { expect } = require('../../app/node_modules/chai');

When('he navigates to configuration', async ()=> {
});

When('he modifies the title to {string}', async (value)=> {
});

Then('he sees that the header displays {string}', async (expected)=> {
    let actual = await World.robot.text('#title');
    expect(actual).to.equal(expected);
});