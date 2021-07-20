const { When, Then } = require('../../app/node_modules/@cucumber/cucumber/lib');
When('I try to delete this event', function () {
    return 'pending';
});

Then('I receive the error message {string}', function (string) {
    return 'pending';
});