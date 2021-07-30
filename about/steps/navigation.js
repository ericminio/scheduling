const { When, World } = require('../../app/node_modules/@cucumber/cucumber/lib');

When('he navigates to calendar', async ()=> {
    await openEvents();
});
When('he navigates to configuration', async ()=> {
    await openConfiguration();
});

let openEvents = async ()=> {
    let menu = await World.robot.findElement('#menu-calendar');
    await menu.click();
    await World.driver.sleep(300);
};

let openConfiguration = async ()=> {
    let menu = await World.robot.findElement('#menu-configuration');
    await menu.click();
    await World.driver.sleep(300);
};

module.exports = {
    openEvents: openEvents,
    openConfiguration: openConfiguration
};