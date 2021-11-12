const { Given, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { By } = require('../../app/node_modules/selenium-webdriver');
const { expect } = require('../../app/node_modules/chai');
const { openComingUp } = require('./navigation');

Given('he opens the coming-up page on {string}', async (date)=> {
    await openComingUp();
    await World.robot.input('#calendar-date', date);
    await World.robot.click('#calendar-search');
    await World.robot.wait(300);
});