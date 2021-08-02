module.exports = {
    SecurityRoute: require('./security-route'),

    Yop: require('./yop'),
    Scripts: require('./scripts'),
    Styles: require('./styles'),

    Ping: require('./ping'),
    GetConfiguration: require('./configuration/get-configuration'),
    UpdateConfiguration: require('./configuration/update-configuration'),

    SignIn: require('./sign-in'),

    SearchEvents: require('./events/search-events'),
    GetAllEvents: require('./events/get-all-events'),
    CreateOneEvent: require('./events/create-one-event'),
    GetOneEvent: require('./events/get-one-event'),
    DeleteOneEvent: require('./events/delete-one-event'),

    GetAllResources: require('./resources/get-all-resources'),
    CreateOneResource: require('./resources/create-one-resource'),
    GetOneResource: require('./resources/get-one-resource'),
    DeleteOneResource: require('./resources/delete-one-resource'),

    NotImplemented: require('./not-implemented'),
    DefaultRoute: require('./defaut-route'),
    ErrorRoute: require('./error-route')
};