const Resource = require("./resource");
const Event = require("./event");
const NextUuid = require('./next-uuid')

class Factory {

    constructor() {
        this.idGenerator = new NextUuid();
    }

    async createResource(incoming) {
        if (incoming.id === undefined) {
            incoming.id = this.idGenerator.next();
        }
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