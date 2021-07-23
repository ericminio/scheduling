module.exports = {
    Ping: require('./ping'),
    Yop: require('./yop'),
    Scripts: require('./scripts'),
    Styles: require('./styles'),
    SignIn: require('./sign-in'),

    GetAllEvents: require('./events/get-all-events'),
    CreateEvent: require('./events/create-event'),
    GetOneEvent: require('./events/get-one-event'),
    DeleteOneEvent: require('./events/delete-one-event')
};