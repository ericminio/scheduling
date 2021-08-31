module.exports = {
    SecurityRoute: require('./security-route'),

    Yop: require('./yop'),
    Scripts: require('./scripts'),
    Styles: require('./styles'),

    Ping: require('./ping'),
    GetConfiguration: require('./configuration/get-configuration'),
    UpdateConfiguration: require('./configuration/update-configuration'),

    SignIn: require('./sign-in'),

    SearchEventsRoute: require('./events/search-events-route'),
    CreateEventRoute: require('./events/create-event-route'),
    DeleteOneEvent: require('./events/delete-event-route'),
    
    GetAllResources: require('./resources/get-all-resources'),
    CreateOneResource: require('./resources/create-one-resource'),
    DeleteOneResource: require('./resources/delete-one-resource'),

    NotImplemented: require('./not-implemented'),
    DefaultRoute: require('./defaut-route'),
    ErrorRoute: require('../yop/error-route')
};