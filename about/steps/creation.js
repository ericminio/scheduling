const { Given, World } = require('../../app/node_modules/@cucumber/cucumber');
const { request } = require('../../app/node/support/request');
const login = require('./login')

Given('I create the following resources', async (resources)=> {
    await login('secret key');
    await World.robot.click('#resource-creation');
    let lines = resources.rawTable;
    for (let i=1; i<lines.length; i++) {
        let data = lines[i];
        let type = data[0];
        let name = data[1];
        await createResource(type, name);
    }
    await World.robot.click('#resource-creation');
});
Given('I create the following events', async (events)=> {
    await login('secret key');
    let response = await request({
        hostname: 'localhost',
        port: World.server.port,
        path: '/data/resources',
        method: 'GET'
    });
    World.resources = JSON.parse(response.body).resources;
    World.getResourceId = (name)=> World.resources.find(r => name == r.name).id;
    await World.robot.click('events');
    
    let lines = events.rawTable;
    for (let i=1; i<lines.length; i++) {
        let data = lines[i];
        await createEvent(data);
    }
    await World.robot.click('events');
});
let createResource = async (type, name)=> {
    await World.robot.input('#resource-type', type);
    await World.robot.input('#resource-name', name);
    await World.robot.click('#create-resource');
}
let createEvent = async (data)=> {
    await World.robot.input('#new-event-label', data[0]);
    await World.robot.input('#new-event-start', data[1]);
    await World.robot.input('#new-event-end', data[2]);
    let resources = data[3].split(',').map(name => { return { id:World.getResourceId(name.trim()) }; })
    for (let i=0; i<World.resources.length; i++) {
        let resource = World.resources[i];
        let checkbox = await World.robot.findElement(`#new-event-resource-${resource.id}`)
        let isSelected = await checkbox.isSelected();
        if (isSelected) {
            await checkbox.click();
        }
        for (let j=0; j<resources.length; j++) {
            let candidate = resources[j];
            if (candidate.id == resource.id) {
                await checkbox.click();
                break;
            }
        }
    }
    await World.robot.click('#create-event');
}
