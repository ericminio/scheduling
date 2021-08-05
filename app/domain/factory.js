const Resource = require("./resource");
const Event = require("./event");

class Factory {

    async createResource(incoming) {
        if (incoming.id === undefined) {
            incoming.id = this.idGenerator.next();
        }
        return new Resource(incoming);
    }

    async createEvent(incoming, resourcesRepository) {
        if (incoming.id === undefined) {
            incoming.id = this.idGenerator.next();
        }
        for (let i=0; i<incoming.resources.length; i++) {
            let resource = incoming.resources[i];
            let id = resource.id;
            if (! await resourcesRepository.get(id)) {
                throw Error(`unknown resource with id "${id}"`);
            }
        }
        return new Event(incoming);
    }
};

module.exports = Factory;