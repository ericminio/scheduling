const { World } = require('../../app/node_modules/@cucumber/cucumber');

let login = async (username, password)=> {
    await World.robot.open("/");
    await World.robot.input('#username', username);
    await World.robot.input('#password', password);
    await World.robot.click('#signin');
};

module.exports = login;