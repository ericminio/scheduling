const { World } = require('../../app/node_modules/@cucumber/cucumber');

let login = async (value)=> {
    await World.robot.open("/");
    await World.robot.input('#login', value);
    await World.robot.click('#signin');
};

module.exports = login;