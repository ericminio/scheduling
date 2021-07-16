const { Before, After, Given, When, Then, World } = require('../../app/node_modules/@cucumber/cucumber');
const { Builder, By } = require('../../app/node_modules/selenium-webdriver');
const { expect } = require('../../app/node_modules/chai');
const { request, post } = require('../../app/node/support/request');
const clear = require('../../app/storage/migrations/clear');

Before(async (testCase)=>{
    let maybeLoaded = require.resolve('../../app/start');
    delete require.cache[maybeLoaded];
    let { server, database } = require('../../app/start');
    World.server = server;
    await clear(database);
    World.driver = await new Builder().forBrowser('firefox').build();
    World.robot = new Robot(World);
    await login('secret key');
});
After(async (testCase)=>{
    await World.driver.quit();
    await World.server.stop();
});

Given('I create the following resources', async (resources)=> {
    await World.robot.click('#resource-creation');
    let lines = resources.rawTable;
    for (let i=1; i<lines.length; i++) {
        let data = lines[i];
        let type = data[0];
        let name = data[1];
        await createResource(type, name);
    }
});
Given('I create the following events', async (events)=> {
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
});
let login = async (value)=> {
    await World.robot.open("/");
    await World.robot.input('#login', value);
    await World.robot.click('#signin');
};
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
class Robot {
    constructor(World) {
        this.World = World;
        this.driver = World.driver;
        this.elements = [
            'yop-route',
            'yop-link'
        ]
    }
    async open(uri) {
        await World.driver.get(`http://localhost:${World.server.port}${uri}`);
    }
    async input(selector, value) {
        let field = await this.findElement(selector);
        await field.clear();
        await field.sendKeys(value);
    }
    async click(selector) {
        let element = await this.findElement(selector);
        await element.click();
    }
    async findElement(selector) {
        try {
            return await this.driver.findElement(By.css(selector))
        }
        catch (error) {
            let shadowRoots = []
            for (let i=0; i<this.elements.length; i++) {
                let name = this.elements[i]
                let doms = await this.driver.findElements(By.css(name))
                shadowRoots = shadowRoots.concat(doms)
            }
            for (let i=0; i<shadowRoots.length; i++) {
                let element = await this.inspect(shadowRoots[i], selector)
                if (element) { return element }
            }
    
            throw new Error('Unable to locate element: ' + selector)
        }
    }
    async inspect(dom, selector) {
        try {
            let search = 'return arguments[0].shadowRoot.querySelector("' + selector + '")'
            let element = await this.driver.executeScript(search, dom)
            if (element) { return element }
    
            var children = []
            for (let k=0; k<this.elements.length; k++) {
                let name = this.elements[k]
                let script = 'return arguments[0].shadowRoot.querySelectorAll("' + name + '")'
                let doms = await this.driver.executeScript(script, dom)
                children = children.concat(doms)
            }
            for (let i=0; i<children.length; i++) {
                let element = await this.inspect(children[i], selector)
                if (element) { return element }
            }
        }
        catch (error) {
            return undefined
        }
    }
}
Given('I look at the events', async ()=> {
    await World.driver.get('http://localhost:'+World.server.port+'/events');
    await World.driver.sleep(300);
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
    let foundResource = await getResourceElement(resourceName);
    let resourceId = await foundResource.getAttribute('id');
    let resourceSelector = '#' + resourceId;
    let resource = await World.driver.findElement(By.css(resourceSelector));
    let resourcePosition = await resource.getCssValue('top');

    let foundEventsWithLabel = await getEventElements(eventLabel);
    let found = await getEventScheduledWith(foundResource, foundEventsWithLabel);
    
    if (!found) {
        throw Error('nope')
    }
});
When('I inspect event {string} scheduled with {string}', async (label, name)=> {
    let resourceElement = await getResourceElement(name);
    let eventsWithLabel = await getEventElements(label);
    let event = await getEventScheduledWith(resourceElement, eventsWithLabel);
    event.click();
});
Then('I see that this event start is {string}', async (expected)=> {
    let element = await World.robot.findElement('#event-info-start');
    let actual = await element.getAttribute('value');
    expect(actual).to.equal(expected);
});
Then('I see that this event end is {string}', async (expected)=> {
    let element = await World.robot.findElement('#event-info-end');
    let actual = await element.getAttribute('value');
    expect(actual).to.equal(expected);
});

let getResourceElement = async (name)=> {
    let candidatesResources = await World.driver.findElements(By.css('yop-calendar-resource'));
    let foundResource;
    for (let i=0; i<candidatesResources.length; i++) {
        let candidate = candidatesResources[i];
        let text = await candidate.getText();
        if (text == name) {
            foundResource = candidate;
            break;
        }
    }
    return foundResource;
};
let getEventElements = async (label)=> {
    let candidatesEvents = await World.driver.findElements(By.css('yop-calendar-event'));
    let foundEventsWithLabel = [];
    for (let i=0; i<candidatesEvents.length; i++) {
        let candidate = candidatesEvents[i];
        let text = await candidate.getText();
        if (text == label) {
            foundEventsWithLabel.push(candidate);
        }
    }
    return foundEventsWithLabel;
}
let getEventScheduledWith = async (resourceElement, candidates)=> {
    let resourcePosition = await resourceElement.getCssValue('top');
    for (let i=0; i<candidates.length; i++) {
        let candidate = candidates[i];
        let elementPosition = await candidate.getCssValue('top');
        if (elementPosition == resourcePosition) {
            return candidate;
        }    
    }
    return undefined;
}