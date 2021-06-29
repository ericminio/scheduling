const { Before, After, Given, When, Then, World } = require('@cucumber/cucumber');
const { Builder, By } = require('selenium-webdriver')

class Server {
    constructor(port) {
        this.port = port;
        this.internal = require('http').createServer(this.route);
    }
    start() {
        this.internal.listen(this.port);
    }
    route(request, response) {
        response.writeHead(200, { 'content-type':'text/html' })
        response.end(require('fs').readFileSync(
            require('path').join(__dirname, '..', '..', 'app', 'http', 'index.html')).toString())
    }
};

Before(async (testCase)=>{
    World.server = new Server(8015);
    await World.server.start()
    World.driver = await new Builder().forBrowser('firefox').build();
});
After(async (testCase)=>{
    await World.driver.quit();
});

Given('the following resources exist in the system', function (resources) {
});
Given('the following events', function (events) {
});
Given('I look at the events grouped by {string}', async (type)=> {
    await World.driver.get('http://localhost:8015/events');
});
When('I move event {string} to start at {string}', function (id, time) {
});
Then('I see that event {string} ends at {string}', async (id, expected)=> {
    let element = await World.driver.findElement(By.css("#event-"+id))
});
