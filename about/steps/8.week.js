const { When, Then, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { By } = require('../../app/node_modules/selenium-webdriver');
const { expect } = require('../../app/node_modules/chai');
const { openCalendarWeek } = require('./navigation');
const { getWeekEventElements, weekdayElement, isElementInsideDay } = require('./support');

When('he opens the week view on {string}', async (date)=> {
    await openCalendarWeek();
    await World.robot.input('#calendar-date', date);
    await World.robot.click('#calendar-search');
    await World.robot.wait(300);
});
Then('he sees that {string} takes place on {string}', async (label, dayname)=> {
    let candidates = await getWeekEventElements(label);
    let eventElement = candidates[0];
    let dayElement = await weekdayElement(dayname);

    expect(await isElementInsideDay(eventElement, dayElement)).to.equal(true);
});

