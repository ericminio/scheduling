const { World } = require('../../app/node_modules/@cucumber/cucumber');
const { By } = require('../../app/node_modules/selenium-webdriver');

let markerPosition = async (time)=> {
    let selector = '#hour-' + time.replace(':', '');
    let marker = await World.driver.findElement(By.css(selector))
    return await marker.getCssValue('left')
};
let weekdayElement = async (dayname)=> {
    let selector = `#day-${dayname.toLowerCase()}`;
    let marker = await World.driver.findElement(By.css(selector));
    return marker;
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
let getWeekEventElements = async (label)=> {
    let candidatesEvents = await World.driver.findElements(By.css('yop-calendar-event-week'));
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
    console.log(candidates.length, 'candidate(s)')
    for (let i=0; i<candidates.length; i++) {
        let candidate = candidates[i];
        let elementPosition = await candidate.getCssValue('top');
        if (elementPosition == resourcePosition) {
            return candidate;
        }    
    }
    return undefined;
};
let isElementInsideDay = async (eventElement, dayElement)=> {
    let eventBox = await box(eventElement);
    let dayBox = await box(dayElement);
    
    return eventBox.left >= dayBox.left && eventBox.right <= dayBox.right;
};
let box = async (element)=> {
    return {
        left: parseInt(await element.getCssValue('left')),
        right: parseInt(await element.getCssValue('left')) + parseInt(await element.getCssValue('width'))
    }
}

module.exports = {
    markerPosition: markerPosition,
    getResourceElement: getResourceElement,
    getEventElements: getEventElements,
    getEventScheduledWith: getEventScheduledWith,
    weekdayElement: weekdayElement,
    isElementInsideDay: isElementInsideDay,
    getWeekEventElements: getWeekEventElements
}