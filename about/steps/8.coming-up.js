const { Given, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { By } = require('../../app/node_modules/selenium-webdriver');
const { expect } = require('../../app/node_modules/chai');
const { openComingUp } = require('./navigation');

Given('today is {string}', async (input)=> {    
    let parts = input.split('-');
    let year = parseInt(parts[0]);
    let month = parseInt(parts[1])-1;
    let day = parseInt(parts[2]);
    let code = `window.today = ()=> { return new Date(${year}, ${month}, ${day}); };`;
    await World.robot.driver.executeScript(code);
});

Given('he opens the coming-up page', async ()=> {
    await openComingUp();
    await World.robot.wait(300);
});
