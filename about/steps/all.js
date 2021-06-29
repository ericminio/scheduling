const {
    Before,
    After,
    Given,
    When,
    Then
} = require('@cucumber/cucumber');

Before((testCase, done)=>{
    done();
});
After((testCase, done)=>{
    done();
});

Given('the following resources exist in the system', function (resources) {
});
Given('the following events', function (events) {
});
Given('I look at the events grouped by {string}', function (type) {
});
When('I move event {string} to start at {string}', function (id, time) {
});
Then('I see that event {string} ends at {string}', function (id, expected) {
});
