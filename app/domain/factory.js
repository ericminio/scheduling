const Resource = require("./resource");
const Event = require("./event");

class Factory {

    async createResource(incoming) {
        return new Resource(incoming);
    }

    async createEvent(incoming, resourcesRepository) {
        for (let i=0; i<incoming.resources.length; i++) {
            let resource = incoming.resources[i];
            let id = resource.id;
            if (! await resourcesRepository.exists(id)) {
                throw Error(`unknown resource with id "${id}"`);
            }
        }
        return new Event(incoming);
    }
};

module.exports = Factory;