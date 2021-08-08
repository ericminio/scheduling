const fs = require('fs');
const path = require('path');

const code = (filename)=> fs.readFileSync(path.join(__dirname, filename)).toString()
const ccode = (filename, classname)=> (new Function(`${code(filename)}; return ${classname};`))()
const fcode = (filename, functionname)=> (new Function(`${code(filename)}; return ${functionname};`))()

module.exports = {
    Resource: ccode('resource.js', 'Resource'),
    Event: ccode('event.js', 'Event'),
    User: ccode('user.js', 'User'),
    Configuration: ccode('configuration.js', 'Configuration'),
    isValidDate: fcode('is-valid-date.js', 'isValidDate'),
    isValidDatetime: fcode('is-valid-datetime.js', 'isValidDatetime'),
    nextDay: fcode('time.js', 'nextDay'),
    previousDay: fcode('time.js', 'previousDay')
}