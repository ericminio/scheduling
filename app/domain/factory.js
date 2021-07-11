const Resource = require("./resource");
const Event = require("./event");

class Factory {

    createResource(incoming) {
        return new Resource(incoming);
    }

    createEvent(incoming) {
        return new Event(incoming);
    }
};

module.exports = Factory;