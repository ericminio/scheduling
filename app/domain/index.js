const fs = require('fs');
const path = require('path');

const code = (filename)=> fs.readFileSync(path.join(__dirname, filename)).toString()
const ccode = (filename, classname)=> (new Function(`${code(filename)}; return ${classname};`))()
const fcode = (filename, functionname)=> (new Function(`${code(filename)}; return ${functionname};`))()

module.exports = {
    Resource: ccode('calendar/resource.js', 'Resource'),
    Event: ccode('calendar/event.js', 'Event'),
    EventFactory: ccode('calendar/event-factory.js', 'EventFactory'),
    User: ccode('user/user.js', 'User'),
    Configuration: ccode('configuration/configuration.js', 'Configuration'),
    isValidDate: fcode('calendar/is-valid-date.js', 'isValidDate'),
    isValidDatetime: fcode('calendar/is-valid-datetime.js', 'isValidDatetime'),
    nextDay: fcode('calendar/time.js', 'nextDay'),
    previousDay: fcode('calendar/time.js', 'previousDay'),
    isAnOverbooking: fcode('calendar/overbooking.js', 'isAnOverbooking'),
    formatDate: fcode('calendar/time.js', 'formatDate')
}