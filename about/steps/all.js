const { Before, After, Given, When, Then, World } = require('../../app/node_modules/@cucumber/cucumber');
const { Builder, By } = require('../../app/node_modules/selenium-webdriver');
const { expect } = require('../../app/node_modules/chai');
const { request, post } = require('../../app/http/js/support/request');
const RepositoryUsingMap = require('../../app/http/js/support/repository-using-map');

Before(async (testCase)=>{
    let maybeLoaded = require.resolve('../../app/start');
    delete require.cache[maybeLoaded];
    World.server = require('../../app/start');
    World.server.services['resources'] = new RepositoryUsingMap();
    World.server.services['events'] = new RepositoryUsingMap();
    World.driver = await new Builder().forBrowser('firefox').build();
});
After(async (testCase)=>{
    await World.driver.quit();
    await World.server.stop();
});

Given('the following resources exist in the system', async (resources)=> {
    let lines = resources.rawTable;
    let fields = lines[0].map(r => r.toLowerCase());
    for (let i=1; i<lines.length; i++) {
        let payload = {};
        let data = lines[i];
        for (let j=0; j<data.length; j++) {
            payload[fields[j]] = data[j];
        }
        let response = await post({
            hostname: 'localhost',
            port: World.server.port,
            path: '/data/resources/create',
            method: 'POST'
        }, payload);
        expect(response.statusCode).to.equal(201);
    }
});
Given('the following events exist in the system', async (events)=> {
    let response = await request({
        hostname: 'localhost',
        port: World.server.port,
        path: '/data/resources',
        method: 'GET'
    });
    let resources = JSON.parse(response.body).resources;
    let getResourceId = (name)=> resources.find(r => name == r.name).id
    
    let lines = events.rawTable;
    for (let i=1; i<lines.length; i++) {
        let data = lines[i];
        let payload = {
            id: data[0],
            start: data[1],
            end: data[2],
            label: data[4],
            resources: data[3].split(',').map(name => { return { id:getResourceId(name.trim()) }; })
        };
        response = await post({
            hostname: 'localhost',
            port: World.server.port,
            path: '/data/events/create',
            method: 'POST'
        }, payload);
        expect(response.statusCode).to.equal(201);
    }
});
Given('I look at the events scheduled with {string}', async (resources)=> {
    await World.driver.get('http://localhost:'+World.server.port+'/events');
});
When('I move event {string} to start at {string}', function (id, start) {
});
Then('I see that {string} starts at {string}', async (label, time)=> {
    let markerSelector = '#hour-' + time.replace(':', '');
    let marker = await World.driver.findElement(By.css(markerSelector))
    let markerPosition = await marker.getCssValue('left')

    let candidates = await World.driver.findElements(By.css('yop-calendar-event'));
    let found;
    for (let i=0; i<candidates.length; i++) {
        let candidate = candidates[i];
        let text = await candidate.getText();
        if (text == label) {
            found = candidate;
            break;
        }
    }
    let id = await found.getAttribute('id');

    let element = await World.driver.findElement(By.css("#"+id))
    let elementPosition = await element.getCssValue('left')
    
    expect(elementPosition).to.equal(markerPosition)
});
Then('I see that {string} ends at {string}', async (label, time)=> {
    let markerSelector = '#hour-' + time.replace(':', '');
    let marker = await World.driver.findElement(By.css(markerSelector))
    let markerPosition = await marker.getCssValue('left')

    let candidates = await World.driver.findElements(By.css('yop-calendar-event'));
    let found;
    for (let i=0; i<candidates.length; i++) {
        let candidate = candidates[i];
        let text = await candidate.getText();
        if (text == label) {
            found = candidate;
            break;
        }
    }
    let id = await found.getAttribute('id');

    let element = await World.driver.findElement(By.css("#"+id))  
    let elementPosition = await element.getCssValue('left')
    let elementWidth = await element.getCssValue('width')
    let actual = parseInt(elementPosition) + parseInt(elementWidth)
    let expected = parseInt(markerPosition)

    expect(Math.abs(actual-expected) < 2).to.equal(true)
});
Then('I see that {string} is scheduled with {string}', async (eventLabel, resourceName)=> {
    let candidatesResources = await World.driver.findElements(By.css('yop-calendar-resource'));
    let foundResource;
    for (let i=0; i<candidatesResources.length; i++) {
        let candidate = candidatesResources[i];
        let text = await candidate.getText();
        if (text == resourceName) {
            foundResource = candidate;
            break;
        }
    }
    let resourceId = await foundResource.getAttribute('id');
    let resourceSelector = '#' + resourceId;
    let resource = await World.driver.findElement(By.css(resourceSelector));
    let resourcePosition = await resource.getCssValue('top');

    let candidatesEvents = await World.driver.findElements(By.css('yop-calendar-event'));
    let foundEventsWithLabel = [];
    for (let i=0; i<candidatesEvents.length; i++) {
        let candidate = candidatesEvents[i];
        let text = await candidate.getText();
        if (text == eventLabel) {
            foundEventsWithLabel.push(candidate);
        }
    }

    let found = false;
    for (let i=0; i<foundEventsWithLabel.length; i++) {
        let foundEvent = foundEventsWithLabel[i];
        let eventId = await foundEvent.getAttribute('id');
        let element = await World.driver.findElement(By.css("#"+eventId));
        let elementPosition = await element.getCssValue('top');
        if (elementPosition == resourcePosition) {
            found = true;
            break;
        }    
    }
    
    if (!found) {
        throw Error('nope')
    }
});
