const { When, Then, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { expect } = require('../../app/node_modules/chai');
const { Configuration } = require('../../app/domain')

When('he navigates to configuration', async ()=> {
});

When('he modifies the title to {string}', async (value)=> {
    await World.server.services['configuration'].save(new Configuration({ title:value }));
    await World.driver.executeScript("return window.location.reload();");
    await World.robot.wait(300);
});

Then('he sees that the header displays {string}', async (expected)=> {
    let actual = await World.robot.text('#title');
    expect(actual).to.equal(expected);
});