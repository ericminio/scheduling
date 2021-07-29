const { When, World } = require('../../app/node_modules/@cucumber/cucumber/lib');

When('he navigates to calendar', async ()=> {
    await openEvents();
});
When('he navigates to configuration', async ()=> {
    await openConfiguration();
});

let openEvents = async ()=> {
    await World.driver.get('http://localhost:'+World.server.port+'/events');
    await World.driver.sleep(300);
};

let openConfiguration = async ()=> {
    await World.driver.get('http://localhost:'+World.server.port+'/configuration');
    await World.driver.sleep(300);
};

module.exports = {
    openEvents: openEvents,
    openConfiguration: openConfiguration
};