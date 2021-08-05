const fs = require('fs');
const path = require('path');

const code = (filename)=> fs.readFileSync(path.join(__dirname, filename)).toString()
const sut = (filename, classname)=> (new Function(`${code(filename)}; return ${classname};`))()

module.exports = {
    Resource: sut('resource.js', 'Resource'),
    Event: sut('event.js', 'Event'),
    User: sut('user.js', 'User'),
    Configuration: sut('configuration.js', 'Configuration')
}