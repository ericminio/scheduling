const { World } = require('../../app/node_modules/@cucumber/cucumber');
const { By } = require('../../app/node_modules/selenium-webdriver');

let markerPosition = async (time)=> {
    let selector = '#hour-' + time.replace(':', '');
    let marker = await World.driver.findElement(By.css(selector))
    return await marker.getCssValue('left')
};
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
};
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
};

module.exports = {
    markerPosition: markerPosition,
    getResourceElement: getResourceElement,
    getEventElements: getEventElements,
    getEventScheduledWith: getEventScheduledWith
}