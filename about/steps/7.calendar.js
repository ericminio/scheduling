const { When, Then, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { By } = require('../../app/node_modules/selenium-webdriver');
const { expect } = require('../../app/node_modules/chai');
const { openCalendarDay } = require('./navigation');

When('I open the calendar on {string}', async (date)=> {
    await openCalendarDay();
    await World.robot.input('#calendar-date', date);
    await World.robot.click('#calendar-search');
    await World.robot.wait(300);
});
When('he opens the calendar on {string}', async (date)=> {
    await openCalendarDay();
    await World.robot.input('#calendar-date', date);
    await World.robot.click('#calendar-search');
    await World.robot.wait(300);
});
Then('he sees that the calendar is empty', async ()=> {
    let candidatesEvents = await World.driver.findElements(By.css('yop-calendar-event'));
    expect(candidatesEvents.length).to.equal(0);
});
Then('I see that the calendar is empty', async ()=> {
    let candidatesEvents = await World.driver.findElements(By.css('yop-calendar-event'));
    expect(candidatesEvents.length).to.equal(0);
});
When('he navigates to the next day', async ()=> {
    await World.robot.click('#calendar-next-day');
});
When('he navigates to the previous day', async ()=> {
    await World.robot.click('#calendar-previous-day');
});