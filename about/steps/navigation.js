const { World } = require('../../app/node_modules/@cucumber/cucumber/lib');

let openEvents = async ()=> {
    await World.driver.get('http://localhost:'+World.server.port+'/events');
    await World.driver.sleep(300);
};

module.exports = {
    openEvents: openEvents
};